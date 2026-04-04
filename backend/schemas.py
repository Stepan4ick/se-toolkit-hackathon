from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime


class QuizGenerateRequest(BaseModel):
    text: str
    title: Optional[str] = "Generated Quiz"
    num_questions: Optional[int] = 5


class QuestionResponse(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: int
    title: str
    source_text: str
    created_at: datetime
    questions: list[QuestionResponse] = []

    class Config:
        from_attributes = True


class AttemptRequest(BaseModel):
    answers: Dict[str, str]  # question_id -> selected option


class AttemptResponse(BaseModel):
    id: int
    quiz_id: int
    score: int
    total_questions: int
    completed_at: datetime

    class Config:
        from_attributes = True
