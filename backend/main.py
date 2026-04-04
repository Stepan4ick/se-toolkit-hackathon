import os
import json
import httpx
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import Quiz, Question, Attempt
from schemas import (
    QuizGenerateRequest, QuizResponse,
    QuestionResponse, AttemptRequest, AttemptResponse
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QuizGen API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_API_URL = os.getenv("LLM_API_URL", "https://openrouter.ai/api/v1")


async def generate_questions_with_llm(text: str, num_questions: int = 5) -> List[dict]:
    prompt = f"""Based on the following text, create {num_questions} multiple-choice quiz questions.
Each question should have 4 options (a, b, c, d) with exactly one correct answer.

TEXT:
{text}

Respond ONLY with a valid JSON array in this exact format:
[
  {{
    "question_text": "What is ...?",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "correct_answer": "a",
    "explanation": "..."
  }}
]

Do not include any text outside the JSON array."""

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{LLM_API_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {LLM_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",
            },
            json={
                "model": "qwen/qwen-2.5-72b-instruct",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7,
            }
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        # Parse JSON from response
        questions = json.loads(content)
        return questions


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/quizzes/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizGenerateRequest, db: Session = Depends(get_db)):
    try:
        questions_data = await generate_questions_with_llm(request.text, request.num_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")

    quiz = Quiz(title=request.title, source_text=request.text)
    db.add(quiz)
    db.flush()

    for q in questions_data:
        question = Question(
            quiz_id=quiz.id,
            question_text=q["question_text"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_answer=q["correct_answer"],
            explanation=q.get("explanation")
        )
        db.add(question)

    db.commit()
    db.refresh(quiz)
    return quiz


@app.get("/api/quizzes", response_model=List[QuizResponse])
def list_quizzes(db: Session = Depends(get_db)):
    return db.query(Quiz).order_by(Quiz.created_at.desc()).all()


@app.get("/api/quizzes/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@app.post("/api/quizzes/{quiz_id}/submit", response_model=AttemptResponse)
def submit_attempt(quiz_id: int, request: AttemptRequest, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    score = 0
    for question in quiz.questions:
        user_answer = request.answers.get(str(question.id))
        if user_answer == question.correct_answer:
            score += 1

    attempt = Attempt(
        quiz_id=quiz_id,
        answers=request.answers,
        score=score,
        total_questions=len(quiz.questions)
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


@app.get("/api/quizzes/{quiz_id}/attempts", response_model=List[AttemptResponse])
def list_attempts(quiz_id: int, db: Session = Depends(get_db)):
    return db.query(Attempt).filter(Attempt.quiz_id == quiz_id).order_by(Attempt.completed_at.desc()).all()
