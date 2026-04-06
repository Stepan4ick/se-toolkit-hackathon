from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import Post, User
from schemas import (
    PostCreate, PostUpdate, PostResponse,
    UserCreate, UserResponse, UserWithPosts,
    Token
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Lost & Found API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== Seed admin user on startup =====
@app.on_event("startup")
def seed_admin():
    db = next(get_db())
    admin = db.query(User).filter(User.email == "stepagrek07@gmail.com").first()
    if not admin:
        admin = User(
            name="Admin",
            email="stepagrek07@gmail.com",
            hashed_password=get_password_hash("QAZWSXEDC"),
            role="admin"
        )
        db.add(admin)
        db.commit()
    db.close()


# ===== Health =====
@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# ===== Auth endpoints =====
@app.post("/api/auth/register", response_model=Token)
def register(request: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=request.name,
        email=request.email,
        hashed_password=get_password_hash(request.password),
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ===== Post endpoints =====
@app.get("/api/posts", response_model=List[PostResponse])
def list_posts(
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None, pattern="^(lost|found)$"),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Post)
    if search:
        pattern = f"%{search}%"
        query = query.filter(Post.title.ilike(pattern) | Post.description.ilike(pattern))
    if type:
        query = query.filter(Post.type == type)
    if category:
        query = query.filter(Post.category == category)
    return query.order_by(Post.created_at.desc()).all()


@app.get("/api/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@app.post("/api/posts", response_model=PostResponse, status_code=201)
def create_post(
    request: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = Post(
        title=request.title,
        description=request.description,
        type=request.type,
        category=request.category,
        location=request.location,
        contact=request.contact,
        author_id=current_user.id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@app.put("/api/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    request: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    db.commit()
    db.refresh(post)
    return post


@app.patch("/api/posts/{post_id}/return", response_model=PostResponse)
def mark_returned(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    post.is_returned = True
    db.commit()
    db.refresh(post)
    return post


@app.delete("/api/posts/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(post)
    db.commit()
    return None


# ===== Admin endpoints =====
@app.get("/api/admin/users", response_model=List[UserWithPosts])
def admin_list_users(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    for user in users:
        user.posts = db.query(Post).filter(Post.author_id == user.id).order_by(Post.created_at.desc()).all()
    return users


@app.get("/api/admin/users/{user_id}/posts", response_model=List[PostResponse])
def admin_get_user_posts(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Post).filter(Post.author_id == user_id).order_by(Post.created_at.desc()).all()
