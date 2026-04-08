from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String

from app.database.models import Base


class CurriculumPlan(Base):
    __tablename__ = "curriculum_plans"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    subject = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    subject = Column(String, nullable=False)
    goal = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class TeachingSession(Base):
    __tablename__ = "teaching_sessions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    topic = Column(String, nullable=False)
    style = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssessmentRun(Base):
    __tablename__ = "assessment_runs"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    topic = Column(String, nullable=False)
    assessment_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class GradingRun(Base):
    __tablename__ = "grading_runs"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assessment_type = Column(String, nullable=False)
    score = Column(Float, nullable=False, default=0.0)
    feedback = Column(String, nullable=True)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ProgressSnapshot(Base):
    __tablename__ = "progress_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    progress_index = Column(Float, nullable=False, default=0.0)
    status = Column(String, nullable=False, default="needs-attention")
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PerformanceInsight(Base):
    __tablename__ = "performance_insights"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    risk_level = Column(String, nullable=False, default="needs-attention")
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    subject = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ReportRecord(Base):
    __tablename__ = "report_records"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class EngagementEvent(Base):
    __tablename__ = "engagement_events"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
