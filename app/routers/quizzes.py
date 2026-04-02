from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import QuizResult, User, Topic
from pydantic import BaseModel
from app.routers.auth import get_current_user
from app.agents.quiz_agent import QuizAgent
import json

router = APIRouter(prefix="/quizzes", tags=["quizzes"])
quiz_agent = QuizAgent()

class QuizGenerate(BaseModel):
    topic_id: int
    num_questions: int = 5

class QuizSubmit(BaseModel):
    topic_id: int
    quiz_text: str
    answers: dict

@router.post("/generate")
def generate_quiz(req: QuizGenerate, db: Session = Depends(get_db)):
    topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    quiz_text = quiz_agent.generate_quiz(topic.title, num_questions=req.num_questions)
    return {"topic_id": req.topic_id, "quiz": quiz_text}

@router.post("/submit")
def submit_quiz(sub: QuizSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit quizzes")

    topic = db.query(Topic).filter(Topic.id == sub.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    evaluation = quiz_agent.evaluate_answers(topic.title, sub.answers, sub.quiz_text, quiz_type="mcq")
    
    # Parse evaluation to get score (dummy parse for now as the LLM returns text)
    # A real implementation would parse the LLM's structured output
    import re
    score_match = re.search(r"Final Score:\s*(\d+)\s*/\s*(\d+)", evaluation)
    score = float(score_match.group(1)) if score_match else 0.0
    total = int(score_match.group(2)) if score_match else len(sub.answers)

    result = QuizResult(
        student_id=current_user.id,
        topic_id=sub.topic_id,
        score=score,
        total=total,
        feedback={"eval_text": evaluation}
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    
    return {"result_id": result.id, "score": score, "total": total, "feedback": evaluation}
