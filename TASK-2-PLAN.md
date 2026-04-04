# Project Idea (Task 2)

## End-user of the product
University students and self-learners who need to study lecture notes, articles, or any long-form text content.

## What problem your product solves for the end-user?
Reading long lecture notes or articles is passive and boring. Students need an active recall method (like flashcards or quizzes) to retain information better. Manually creating quizzes from study materials takes a lot of time and effort.

## The product idea in one short sentence
Upload any text or document, and instantly generate interactive quizzes for active recall learning.

## What is the product's core feature?
Automatic quiz generation from uploaded text/documents using LLM, with an interactive quiz-taking interface and progress tracking.

---

# Implementation Plan

## Version 1 — Core Feature (One thing, done well)

### Goal
A functioning web app where a user can paste text or upload a document, and the system generates a quiz using LLM.

### Components

**Backend:**
- FastAPI application
- LLM integration (via OpenRouter or similar API) to generate quiz questions from text
- Store generated quizzes in PostgreSQL database
- REST API endpoints:
  - `POST /api/quizzes/generate` — generate quiz from text
  - `GET /api/quizzes/{id}` — get a quiz
  - `POST /api/quizzes/{id}/submit` — submit answers and get score

**Database:**
- PostgreSQL
- Tables: `quizzes`, `questions`, `attempts`

**Frontend (Web App):**
- Simple HTML/CSS/JS interface
- Text input area for pasting content or file upload
- Quiz display with multiple-choice or open-answer questions
- Results page showing score and correct answers

### Technology Stack
- **Backend:** Python + FastAPI
- **Database:** PostgreSQL
- **Frontend:** Vanilla HTML/CSS/JS (or Bootstrap for styling)
- **LLM API:** OpenRouter (Qwen or similar model)
- **Containerization:** Docker + Docker Compose

---

## Version 2 — Enhanced & Deployed

### Goal
Improve Version 1 based on TA feedback, add user features, and deploy.

### Possible Enhancements (based on TA feedback)
- **User accounts:** Track quiz history and performance per user
- **Multiple quiz types:** Multiple choice, true/false, short answer
- **Spaced repetition:** Schedule review of difficult questions
- **Export/Import:** Share quizzes with peers via links or files
- **UI improvements:** Better styling, progress dashboard
- **Document parsing:** Support PDF, DOCX, PPTX file uploads

### Deployment
- Dockerize all services (backend, database, frontend)
- Deploy on university VM or cloud platform (e.g., Railway, Render, or similar)
- Ensure all services communicate via Docker Compose network
- Make the deployed product publicly accessible

### Deliverables
- GitHub repository with full source code
- MIT license
- README with product description, features, usage, and deployment instructions
- Pre-recorded demo video (max 2 minutes with voice-over)
