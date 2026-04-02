from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User, Course, Topic
from app.routers.auth import get_current_user
from app.agents.analytics_agent import AnalyticsAgent

router = APIRouter(prefix="/analytics", tags=["analytics"])
analytics_agent = AnalyticsAgent()

@router.get("/student/{course_id}")
def student_mastery(course_id: int, student_id: int = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    target_id = current_user.id
    if current_user.role == "teacher" and student_id:
        target_id = student_id
        
    mastery = analytics_agent.calculate_topic_mastery(db, target_id, course_id)
    return {"student_id": target_id, "course_id": course_id, "mastery": mastery}

@router.get("/course/{course_id}/risk")
def course_risk(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view course risks")
        
    at_risk = analytics_agent.get_at_risk_students(db, course_id)
    return {"course_id": course_id, "at_risk": at_risk}
