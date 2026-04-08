from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from app.agents.assignment_agent import AssignmentAgent
from app.agents.course_creation_agent import CourseCreationAgent
from app.agents.notification_agent import NotificationAgent
from app.agents.organizer_agent import OrganizerAgent
from app.agents.planner_agent import PlannerAgent
from app.agents.quiz_agent import QuizAgent
from app.agents.revision_agent import RevisionAgent
from app.services.llm_service import generate_with_retry, get_llm


def _extract_json_payload(response_text: str, default: Dict[str, Any]) -> Dict[str, Any]:
    if not response_text:
        return default

    candidates = [response_text.strip()]
    if "```json" in response_text:
        candidates.append(response_text.split("```json", 1)[1].split("```", 1)[0].strip())
    if "```" in response_text:
        candidates.append(response_text.split("```", 1)[1].split("```", 1)[0].strip())

    for candidate in candidates:
        try:
            return json.loads(candidate)
        except Exception:
            continue
    return default


class CurriculumAgent:
    def __init__(self) -> None:
        self.llm = get_llm("gemini-2.5-flash")
        self.course_creator = CourseCreationAgent()

    def generate_curriculum(
        self,
        subject: str,
        duration: str,
        context: str = "",
        learning_goals: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        goals_text = "\n".join(f"- {goal}" for goal in (learning_goals or [])) or "- Cover the core foundations first."
        prompt = f"""
        You are the Curriculum Agent for an Agentic Classroom.

        Build a structured curriculum for:
        Subject: {subject}
        Duration: {duration}
        Additional context: {context}
        Learning goals:
        {goals_text}

        Return ONLY valid JSON with this shape:
        {{
          "subject": "{subject}",
          "duration": "{duration}",
          "modules": [
            {{
              "title": "Module title",
              "description": "Short module summary",
              "difficulty": "beginner|intermediate|advanced",
              "estimated_time": "2 hours",
              "topics": [
                {{
                  "title": "Topic title",
                  "description": "Topic details",
                  "prerequisites": ["Concept 1"],
                  "learning_outcomes": ["Outcome 1"],
                  "resources": ["Optional resource or search query"]
                }}
              ]
            }}
          ]
        }}
        """
        response_text = generate_with_retry(self.llm, prompt, retries=3)
        default = self.course_creator.generate_course_structure(subject, duration, context)
        curriculum = _extract_json_payload(response_text, default)
        curriculum.setdefault("subject", subject)
        curriculum.setdefault("duration", duration)
        curriculum.setdefault("modules", [])
        return curriculum


class PlanningAgent:
    def __init__(self) -> None:
        self.planner = PlannerAgent()

    def create_plan(
        self,
        user_goal: str,
        user_knowledge_summary: str,
        subject: str = "Unknown",
        style: str = "Unknown",
    ) -> str:
        return self.planner.create_plan(user_goal, user_knowledge_summary, subject=subject, style=style)


class TeachingAgent:
    def __init__(self) -> None:
        self.llm = get_llm("gemini-2.5-flash")

    def explain_concept(
        self,
        topic: str,
        style: str = "Descriptive",
        level: str = "beginner",
        context: str = "",
    ) -> Dict[str, Any]:
        prompt = f"""
        You are the Teaching Agent for an Agentic Classroom.

        Explain the topic '{topic}' for a {level} learner.
        Learning style: {style}
        Context: {context}

        Return ONLY valid JSON with this shape:
        {{
          "topic": "{topic}",
          "explanation": "Clear explanation",
          "examples": ["Example 1", "Example 2"],
          "checkpoints": ["What is...", "How does..."],
          "related_topics": ["Topic A", "Topic B"],
          "youtube_query": "short search query"
        }}
        """
        response_text = generate_with_retry(self.llm, prompt, retries=3)
        default = {
            "topic": topic,
            "explanation": f"A concise explanation of {topic}.",
            "examples": [],
            "checkpoints": [],
            "related_topics": [],
            "youtube_query": topic,
        }
        teaching_payload = _extract_json_payload(response_text, default)
        teaching_payload.setdefault("topic", topic)
        return teaching_payload


class AssessmentAgent:
    def __init__(self) -> None:
        self.assignment_agent = AssignmentAgent()
        self.quiz_agent = QuizAgent()

    def generate_assignment(
        self,
        topic: str,
        difficulty: str = "medium",
        assignment_type: str = "coding",
    ) -> Dict[str, Any]:
        return self.assignment_agent.generate_assignment(topic, difficulty=difficulty, assignment_type=assignment_type)

    def generate_quiz(
        self,
        subject: str,
        roadmap: str = "",
        num_questions: int = 5,
        user_goal: str = "",
    ) -> Dict[str, Any]:
        quiz_text = self.quiz_agent.generate_quiz(subject, roadmap=roadmap, num_questions=num_questions, user_goal=user_goal)
        return {
            "subject": subject,
            "num_questions": num_questions,
            "quiz_text": quiz_text,
        }

    def evaluate_assignment(
        self,
        assignment_details: Dict[str, Any],
        submission_content: str,
        assignment_type: str = "coding",
    ) -> Dict[str, Any]:
        return self.assignment_agent.evaluate_submission(assignment_details, submission_content, assignment_type=assignment_type)

    def evaluate_quiz(
        self,
        subject: str,
        user_answers: Dict[str, Any],
        quiz_text: str,
        quiz_type: str = "mcq",
    ) -> str:
        return self.quiz_agent.evaluate_answers(subject, user_answers, quiz_text, quiz_type=quiz_type)


class AutoGradingAgent:
    def __init__(self) -> None:
        self.llm = get_llm("gemini-2.5-flash")
        self.assignment_agent = AssignmentAgent()
        self.quiz_agent = QuizAgent()

    def grade_submission(
        self,
        assessment_type: str,
        prompt_or_details: Dict[str, Any],
        submission_content: str,
        total_marks: float = 10.0,
        rubric: str = "",
    ) -> Dict[str, Any]:
        prompt = f"""
        You are an automatic grading assistant.

        Assessment type: {assessment_type}
        Assessment details: {json.dumps(prompt_or_details)}
        Student submission: {submission_content}
        Total marks: {total_marks}
        Rubric: {rubric}

        Return ONLY valid JSON in this shape:
        {{
          "score": 8.5,
          "feedback": "Detailed feedback",
          "strengths": ["What went well"],
          "gaps": ["What needs work"],
          "next_steps": ["What to study next"]
        }}
        """
        response_text = generate_with_retry(self.llm, prompt, retries=3)
        default = {
            "score": 0.0,
            "feedback": "Grading failed.",
            "strengths": [],
            "gaps": [],
            "next_steps": [],
        }
        grading_payload = _extract_json_payload(response_text, default)
        grading_payload.setdefault("score", 0.0)
        grading_payload.setdefault("feedback", "")
        return grading_payload


class ProgressTrackingAgent:
    def build_snapshot(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        completion = float(metrics.get("completion_rate", 0.0) or 0.0)
        average_score = float(metrics.get("average_score", 0.0) or 0.0)
        attendance_rate = float(metrics.get("attendance_rate", 0.0) or 0.0)
        engagement_rate = float(metrics.get("engagement_rate", 0.0) or 0.0)

        progress_index = round((completion * 0.35) + (average_score * 0.35) + (attendance_rate * 0.15) + (engagement_rate * 0.15), 2)
        if progress_index >= 80:
            status = "on-track"
        elif progress_index >= 55:
            status = "needs-attention"
        else:
            status = "at-risk"

        return {
            "progress_index": progress_index,
            "status": status,
            "completion_rate": completion,
            "average_score": average_score,
            "attendance_rate": attendance_rate,
            "engagement_rate": engagement_rate,
            "topics_completed": metrics.get("topics_completed", []),
            "missing_topics": metrics.get("missing_topics", []),
        }


class PerformanceAnalysisAgent:
    def analyze(self, progress_snapshot: Dict[str, Any], mastery_by_topic: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        mastery_by_topic = mastery_by_topic or []
        weak_topics = [topic for topic in mastery_by_topic if float(topic.get("mastery", 0.0) or 0.0) < 60.0]
        risk_level = progress_snapshot.get("status", "needs-attention")
        if weak_topics and risk_level == "on-track":
            risk_level = "needs-attention"
        if progress_snapshot.get("progress_index", 0.0) < 55:
            risk_level = "at-risk"

        return {
            "risk_level": risk_level,
            "weak_topics": weak_topics,
            "strong_topics": [topic for topic in mastery_by_topic if float(topic.get("mastery", 0.0) or 0.0) >= 80.0],
            "recommended_focus": [topic.get("title") for topic in weak_topics][:5],
            "summary": "Progress is stable." if risk_level == "on-track" else "Performance needs intervention.",
        }


class FeedbackAgent:
    def __init__(self) -> None:
        self.revision_agent = RevisionAgent()
        self.llm = get_llm("gemini-2.5-flash")

    def generate_recommendations(
        self,
        subject: str,
        performance_summary: Dict[str, Any],
        style: str = "balanced",
    ) -> Dict[str, Any]:
        weak_topics = performance_summary.get("recommended_focus", [])
        evaluation_text = json.dumps(performance_summary, indent=2)
        revision_text = self.revision_agent.revise(topic=subject, subject=subject, evaluation_text=evaluation_text, style=style.title(), tone="Neutral")
        return {
            "subject": subject,
            "weak_topics": weak_topics,
            "revision_text": revision_text,
            "next_steps": [f"Review: {topic}" for topic in weak_topics] or [f"Revise the core ideas in {subject}"],
            "study_tip": "Use short sessions, then test yourself with active recall.",
        }


class ReportingAgent:
    def __init__(self) -> None:
        self.llm = get_llm("gemini-2.5-flash")
        self.organizer = OrganizerAgent()

    def build_course_report(self, summary_data: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        You are a reporting agent.
        Summarize the following classroom analytics into a concise teacher report.
        Data: {json.dumps(summary_data)}

        Return ONLY valid JSON in this shape:
        {{
          "overview": "Short overview",
          "strengths": ["Strength 1"],
          "gaps": ["Gap 1"],
          "actions": ["Action 1"],
          "at_risk_students": ["Student names or ids"],
          "chart_notes": ["Suggested chart or visual insight"]
        }}
        """
        response_text = generate_with_retry(self.llm, prompt, retries=3)
        default = {
            "overview": "Classroom report generated from current analytics.",
            "strengths": [],
            "gaps": [],
            "actions": [],
            "at_risk_students": summary_data.get("at_risk_students", []),
            "chart_notes": [],
        }
        report = _extract_json_payload(response_text, default)
        report.setdefault("at_risk_students", summary_data.get("at_risk_students", []))
        return report


class EngagementAgent:
    def __init__(self) -> None:
        self.notification_agent = NotificationAgent()

    def generate_engagement_actions(self, engagement_data: Dict[str, Any]) -> Dict[str, Any]:
        streak_days = int(engagement_data.get("streak_days", 0) or 0)
        missed_deadlines = int(engagement_data.get("missed_deadlines", 0) or 0)
        low_activity = float(engagement_data.get("activity_rate", 0.0) or 0.0) < 50.0

        nudges = []
        if streak_days >= 5:
            nudges.append("Keep the streak alive with one focused session today.")
        if missed_deadlines > 0:
            nudges.append("Review the missed deadlines and break the work into smaller tasks.")
        if low_activity:
            nudges.append("Reopen the classroom material and complete one quick practice task.")
        if not nudges:
            nudges.append("You are active. Keep following the current plan.")

        badge = "Consistency Builder" if streak_days >= 5 else "Momentum Starter"
        return {
            "badge": badge,
            "nudges": nudges,
            "streak_days": streak_days,
            "missed_deadlines": missed_deadlines,
            "activity_rate": engagement_data.get("activity_rate", 0.0),
        }
