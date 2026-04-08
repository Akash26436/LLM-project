from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.agents.agentic_system import (
    AssessmentAgent,
    AutoGradingAgent,
    CurriculumAgent,
    EngagementAgent,
    FeedbackAgent,
    PerformanceAnalysisAgent,
    PlanningAgent,
    ProgressTrackingAgent,
    ReportingAgent,
    TeachingAgent,
)
from app.agents.attendance_agent import AttendanceAgent
from app.database.agentic_models import (
    AssessmentRun,
    CurriculumPlan,
    EngagementEvent,
    PerformanceInsight,
    ProgressSnapshot,
    GradingRun,
    Recommendation,
    ReportRecord,
    StudyPlan,
    TeachingSession,
)
from app.database.session import get_db

router = APIRouter(prefix="/agentic", tags=["agentic-learning"])


class CurriculumRequest(BaseModel):
    subject: str
    duration: str = "4 weeks"
    context: str = ""
    learning_goals: List[str] = Field(default_factory=list)
    course_id: Optional[int] = None
    teacher_id: Optional[int] = None


class PlanRequest(BaseModel):
    user_goal: str
    user_knowledge_summary: str
    subject: str = "Unknown"
    style: str = "Unknown"
    course_id: Optional[int] = None
    student_id: Optional[int] = None


class TeachingRequest(BaseModel):
    topic: str
    style: str = "Descriptive"
    level: str = "beginner"
    context: str = ""
    course_id: Optional[int] = None
    student_id: Optional[int] = None


class AssessmentRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    assignment_type: str = "coding"
    roadmap: str = ""
    num_questions: int = 5
    user_goal: str = ""
    course_id: Optional[int] = None
    student_id: Optional[int] = None


class GradingRequest(BaseModel):
    assessment_type: str = "assignment"
    prompt_or_details: Dict[str, Any] = Field(default_factory=dict)
    submission_content: str
    total_marks: float = 10.0
    rubric: str = ""
    course_id: Optional[int] = None
    student_id: Optional[int] = None


class ProgressRequest(BaseModel):
    course_id: Optional[int] = None
    student_id: Optional[int] = None
    metrics: Dict[str, Any] = Field(default_factory=dict)


class PerformanceRequest(BaseModel):
    course_id: Optional[int] = None
    student_id: Optional[int] = None
    progress_snapshot: Dict[str, Any] = Field(default_factory=dict)
    mastery_by_topic: List[Dict[str, Any]] = Field(default_factory=list)


class FeedbackRequest(BaseModel):
    subject: str
    course_id: Optional[int] = None
    student_id: Optional[int] = None
    performance_summary: Dict[str, Any] = Field(default_factory=dict)
    style: str = "balanced"


class ReportRequest(BaseModel):
    course_id: int
    summary_data: Dict[str, Any] = Field(default_factory=dict)


class EngagementRequest(BaseModel):
    course_id: Optional[int] = None
    student_id: Optional[int] = None
    engagement_data: Dict[str, Any] = Field(default_factory=dict)


@router.post("/curriculum")
def generate_curriculum(payload: CurriculumRequest, db: Session = Depends(get_db)):
    agent = CurriculumAgent()
    result = agent.generate_curriculum(
        payload.subject,
        payload.duration,
        context=payload.context,
        learning_goals=payload.learning_goals,
    )
    record = CurriculumPlan(
        course_id=payload.course_id,
        teacher_id=payload.teacher_id,
        subject=payload.subject,
        duration=payload.duration,
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"curriculum": result, "record_id": record.id}


@router.post("/plans")
def generate_plan(payload: PlanRequest, db: Session = Depends(get_db)):
    agent = PlanningAgent()
    result = agent.create_plan(
        payload.user_goal,
        payload.user_knowledge_summary,
        subject=payload.subject,
        style=payload.style,
    )
    record = StudyPlan(
        course_id=payload.course_id,
        student_id=payload.student_id,
        subject=payload.subject,
        goal=payload.user_goal,
        payload={"plan": result, "style": payload.style},
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"plan": result, "record_id": record.id}


@router.post("/teach")
def teach(payload: TeachingRequest, db: Session = Depends(get_db)):
    agent = TeachingAgent()
    result = agent.explain_concept(payload.topic, style=payload.style, level=payload.level, context=payload.context)
    record = TeachingSession(
        course_id=payload.course_id,
        student_id=payload.student_id,
        topic=payload.topic,
        style=payload.style,
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"teaching": result, "record_id": record.id}


@router.post("/assessment")
def create_assessment(payload: AssessmentRequest, db: Session = Depends(get_db)):
    agent = AssessmentAgent()
    assignment = agent.generate_assignment(payload.topic, difficulty=payload.difficulty, assignment_type=payload.assignment_type)
    quiz = agent.generate_quiz(
        payload.topic,
        roadmap=payload.roadmap,
        num_questions=payload.num_questions,
        user_goal=payload.user_goal,
    )
    record = AssessmentRun(
        course_id=payload.course_id,
        student_id=payload.student_id,
        topic=payload.topic,
        assessment_type=payload.assignment_type,
        payload={"assignment": assignment, "quiz": quiz},
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"assignment": assignment, "quiz": quiz, "record_id": record.id}


@router.post("/grade")
def grade_submission(payload: GradingRequest, db: Session = Depends(get_db)):
    agent = AutoGradingAgent()
    result = agent.grade_submission(
        payload.assessment_type,
        payload.prompt_or_details,
        payload.submission_content,
        total_marks=payload.total_marks,
        rubric=payload.rubric,
    )
    record = GradingRun(
        course_id=payload.course_id,
        student_id=payload.student_id,
        assessment_type=payload.assessment_type,
        score=float(result.get("score", 0.0) or 0.0),
        feedback=result.get("feedback", ""),
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"grading": result, "record_id": record.id}


@router.post("/progress")
def record_progress(payload: ProgressRequest, db: Session = Depends(get_db)):
    agent = ProgressTrackingAgent()
    snapshot = agent.build_snapshot(payload.metrics)
    record = ProgressSnapshot(
        course_id=payload.course_id,
        student_id=payload.student_id,
        progress_index=float(snapshot.get("progress_index", 0.0) or 0.0),
        status=snapshot.get("status", "needs-attention"),
        payload=snapshot,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"snapshot": snapshot, "record_id": record.id}


@router.post("/performance")
def analyze_performance(payload: PerformanceRequest, db: Session = Depends(get_db)):
    agent = PerformanceAnalysisAgent()
    result = agent.analyze(payload.progress_snapshot, mastery_by_topic=payload.mastery_by_topic)
    record = PerformanceInsight(
        course_id=payload.course_id,
        student_id=payload.student_id,
        risk_level=result.get("risk_level", "needs-attention"),
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"analysis": result, "record_id": record.id}


@router.post("/feedback")
def generate_feedback(payload: FeedbackRequest, db: Session = Depends(get_db)):
    agent = FeedbackAgent()
    result = agent.generate_recommendations(payload.subject, payload.performance_summary, style=payload.style)
    record = Recommendation(
        course_id=payload.course_id,
        student_id=payload.student_id,
        subject=payload.subject,
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"feedback": result, "record_id": record.id}


@router.post("/report")
def generate_report(payload: ReportRequest, db: Session = Depends(get_db)):
    agent = ReportingAgent()
    result = agent.build_course_report(payload.summary_data)
    record = ReportRecord(
        course_id=payload.course_id,
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"report": result, "record_id": record.id}


@router.post("/engagement")
def generate_engagement(payload: EngagementRequest, db: Session = Depends(get_db)):
    agent = EngagementAgent()
    result = agent.generate_engagement_actions(payload.engagement_data)
    record = EngagementEvent(
        course_id=payload.course_id,
        student_id=payload.student_id,
        event_type="engagement_nudge",
        payload=result,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"engagement": result, "record_id": record.id}


@router.get("/dashboard/{course_id}")
def get_classroom_dashboard(course_id: int, db: Session = Depends(get_db)):
    attendance_agent = AttendanceAgent()
    report_agent = ReportingAgent()

    attendance = attendance_agent.get_attendance_summary(db, course_id)
    report = report_agent.build_course_report({
        "course_id": course_id,
        "attendance": attendance,
        "at_risk_students": [row["student_name"] for row in attendance if row.get("at_risk")],
    })
    return {
        "course_id": course_id,
        "attendance": attendance,
        "report": report,
    }
