from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# ===== User schemas =====
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithPosts(UserResponse):
    posts: List["PostResponse"] = []


# ===== Auth schemas =====
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class UserLogin(BaseModel):
    username: str
    password: str


# ===== Post schemas =====
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    type: str = Field(..., pattern="^(lost|found)$")
    category: str = Field(..., pattern="^(electronics|documents|clothing|accessories|other)$")
    location: Optional[str] = Field(None, max_length=255)
    contact: str = Field(..., min_length=1, max_length=255)


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    type: Optional[str] = Field(None, pattern="^(lost|found)$")
    category: Optional[str] = Field(None, pattern="^(electronics|documents|clothing|accessories|other)$")
    location: Optional[str] = Field(None, max_length=255)
    contact: Optional[str] = Field(None, max_length=255)


class PostResponse(BaseModel):
    id: int
    title: str
    description: str
    type: str
    category: str
    location: Optional[str] = None
    contact: str
    is_returned: bool
    created_at: datetime
    author_id: int

    class Config:
        from_attributes = True
