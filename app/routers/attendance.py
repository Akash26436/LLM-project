from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User, Enrollment, Course
from app.routers.auth import get_current_user
from app.agents.attendance_agent import AttendanceAgent

router = APIRouter(prefix="/attendance", tags=["attendance"])
attendance_agent = AttendanceAgent()

@router.post("/{course_id}/mark")
def mark_attendance(course_id: int, student_id: int, status: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can mark attendance")

    enrollment = db.query(Enrollment).filter(Enrollment.course_id == course_id, Enrollment.student_id == student_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    if status not in ["present", "absent", "late"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    att = attendance_agent.mark_attendance(db, enrollment.id, status)
    return {"message": "Attendance marked", "status": att.status, "date": att.date}

@router.get("/{course_id}/summary")
def get_summary(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view summary")
    
    # Check if teacher owns the course
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course or course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your course")

    return attendance_agent.get_attendance_summary(db, course_id)
