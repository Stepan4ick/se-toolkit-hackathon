# Project Idea (Task 2)

## End-user of the product
University students and staff who lose or find items on campus.

## What problem your product solves for the end-user?
Lost items are hard to find centrally — students check random chat groups, bulletin boards, or nothing at all. There's no single place to publish and search for lost & found items on campus.

## The product idea in one short sentence
A unified platform where students and staff can publish and search lost & found items on campus.

## What is the product's core feature?
Create a post about a lost or found item with categories, search, and mark items as returned.

---

# Implementation Plan

## Version 1 — Core Feature (One thing, done well)

### Goal
A functioning web app where users can create and browse lost & found posts with search and categories.

### Components

**Backend:**
- FastAPI application
- PostgreSQL database for storing posts
- REST API endpoints:
  - `GET /api/posts` — list all posts (with optional search query)
  - `GET /api/posts/{id}` — get a specific post
  - `POST /api/posts` — create a new post
  - `PUT /api/posts/{id}` — update a post
  - `PATCH /api/posts/{id}/return` — mark as returned
  - `DELETE /api/posts/{id}` — delete a post

**Database:**
- PostgreSQL
- Table: `posts` (id, title, description, category, type, contact, is_returned, created_at)

**Frontend (Web App):**
- Simple HTML/CSS/JS interface
- Main page with feed of all posts + search bar
- Create post form
- Post detail view
- Categories filter

### Technology Stack
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL
- **Frontend:** Vanilla HTML/CSS/JS (Bootstrap for styling)
- **Containerization:** Docker + Docker Compose

---

## Version 2 — Enhanced & Deployed

### Goal
Improve Version 1 based on TA feedback, add features, and deploy.

### Possible Enhancements (based on TA feedback)
- **Filters:** By location (building, floor) and date
- **Photo upload:** Attach images to posts
- **Contact/Chat:** Direct messaging or contact info for owners
- **Email notifications:** Alert users when a matching item is posted
- **Moderation:** Admin approval before posts go live
- **User accounts:** Track your posts and responses

### Deployment
- Dockerize all services (backend, database, frontend)
- Deploy on university VM or cloud platform (e.g., Railway, Render)
- Ensure all services communicate via Docker Compose network
- Make the deployed product publicly accessible

### Deliverables
- GitHub repository with full source code
- MIT license
- README with product description, features, usage, and deployment instructions
- Pre-recorded demo video (max 2 minutes with voice-over)
