from sqlalchemy.orm import Session
from app.database.models import User, Enrollment, Submission, QuizResult, Course, Topic
from sqlalchemy import func

class AnalyticsAgent:
    """
    AnalyticsAgent computes metrics like topic mastery and identifies at-risk students.
    """
    def __init__(self):
        pass

    def calculate_topic_mastery(self, db: Session, student_id: int, course_id: int) -> dict:
        """
        Returns mastery percentage per topic for a student in a specific course.
        """
        topics = db.query(Topic).filter(Topic.course_id == course_id).all()
        mastery = []
        for topic in topics:
            # Average quiz score for this topic
            quiz_avg = db.query(func.avg(QuizResult.score * 100 / QuizResult.total)).filter(
                QuizResult.student_id == student_id,
                QuizResult.topic_id == topic.id,
                QuizResult.total > 0
            ).scalar() or 0.0

            # Average assignment score (out of 10) for this topic
            assignment_avg = db.query(func.avg(Submission.score)).join(Submission.assignment).filter(
                Submission.student_id == student_id,
                Submission.score.isnot(None),
                Submission.assignment.has(topic_id=topic.id)
            ).scalar() or 0.0

            # Combined mastery weighting (60% assignment, 40% quiz)
            topic_mastery = (assignment_avg * 10 * 0.6) + (quiz_avg * 0.4)
            mastery.append({
                "topic_id": topic.id,
                "title": topic.title,
                "mastery": min(100.0, max(0.0, topic_mastery))
            })
        return mastery

    def get_at_risk_students(self, db: Session, course_id: int):
        from app.agents.attendance_agent import AttendanceAgent
        attendance_agent = AttendanceAgent()
        attendance_summary = attendance_agent.get_attendance_summary(db, course_id)
        
        at_risk = []
        for enr in attendance_summary:
            if enr["at_risk"]:
                at_risk.append({
                    "student_id": enr["student_id"],
                    "student_name": enr["student_name"],
                    "reason": f"Low attendance ({enr['percentage']:.1f}%)"
                })
                continue
                
            # Could also check low quiz scores here
        return at_risk
