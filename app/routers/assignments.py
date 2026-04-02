from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Assignment, Submission, User, Topic
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.routers.auth import get_current_user
from app.agents.assignment_agent import AssignmentAgent

router = APIRouter(prefix="/assignments", tags=["assignments"])
assignment_agent = AssignmentAgent()

class AssignmentGenerate(BaseModel):
    topic_id: int
    difficulty: str = "medium"
    type: str = "coding"

class SubmissionCreate(BaseModel):
    assignment_id: int
    content: str # can be code or text

@router.post("/generate")
def generate_assignment(req: AssignmentGenerate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can generate assignments")
        
    topic = db.query(Topic).filter(Topic.id == req.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    generated = assignment_agent.generate_assignment(topic.title, req.difficulty, req.type)
    
    assignment = Assignment(
        title=generated.get("title", f"Assignment for {topic.title}"),
        description=generated.get("description", ""),
        difficulty=req.difficulty,
        topic_id=req.topic_id,
        deadline=datetime.utcnow() # would need proper handling
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return {"assignment": assignment, "details": generated}

@router.get("/topic/{topic_id}")
def get_assignments(topic_id: int, db: Session = Depends(get_db)):
    return db.query(Assignment).filter(Assignment.topic_id == topic_id).all()

@router.post("/submit")
def submit_assignment(sub: SubmissionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit")

    assignment = db.query(Assignment).filter(Assignment.id == sub.assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Reconstruct assignment context for evaluation (ideally saved in DB)
    details = {"title": assignment.title, "description": assignment.description}
    
    # Auto-evaluate
    evaluation = assignment_agent.evaluate_submission(details, sub.content)
    
    submission = Submission(
        student_id=current_user.id,
        assignment_id=sub.assignment_id,
        content=sub.content,
        score=evaluation.get("score"),
        feedback=evaluation.get("feedback")
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return {"message": "Submission received", "score": submission.score, "feedback": submission.feedback}
