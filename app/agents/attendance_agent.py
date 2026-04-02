from sqlalchemy.orm import Session
from app.database.models import User, Enrollment, Attendance
from datetime import datetime, timedelta

class AttendanceAgent:
    """
    AttendanceAgent tracks student attendance and generates alerts for low attendance.
    """
    def __init__(self):
        pass

    def mark_attendance(self, db: Session, enrollment_id: int, status: str):
        attendance = Attendance(enrollment_id=enrollment_id, status=status)
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
        return attendance

    def get_attendance_summary(self, db: Session, course_id: int):
        from sqlalchemy import func
        
        enrollments = db.query(Enrollment).filter(Enrollment.course_id == course_id).all()
        summary = []
        for enr in enrollments:
            total_classes = db.query(Attendance).filter(Attendance.enrollment_id == enr.id).count()
            present_classes = db.query(Attendance).filter(Attendance.enrollment_id == enr.id, Attendance.status == "present").count()
            
            percentage = (present_classes / total_classes * 100) if total_classes > 0 else 100.0
            
            summary.append({
                "student_id": enr.student_id,
                "student_name": enr.student.name if enr.student else "Unknown",
                "enrollment_id": enr.id,
                "total_classes": total_classes,
                "present_classes": present_classes,
                "percentage": percentage,
                "at_risk": percentage < 75.0
            })
        return summary
