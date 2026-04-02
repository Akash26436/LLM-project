import json
from app.services.llm_service import get_llm, generate_with_retry

class AssignmentAgent:
    """
    AssignmentAgent evaluates what topics a student has completed and
    generates tailored assignments (coding tasks or textual Q&A) to test their mastery.
    """
    def __init__(self):
        self.llm = get_llm("gemini-2.5-flash")

    def generate_assignment(self, topic: str, difficulty: str = "medium", assignment_type: str = "coding") -> dict:
        """
        Generates an assignment based on topic and difficulty.
        """
        if assignment_type == "coding":
            task_type = "a coding problem"
        else:
            task_type = "a short essay question"

        prompt = f"""
        You are an expert Teacher Assistant for an Agentic Classroom.
        Create {task_type} for the topic '{topic}' with a '{difficulty}' difficulty level.

        Return ONLY valid JSON in the following format:
        {{
            "title": "Assignment Title",
            "description": "Clear problem statement or question.",
            "hints": ["Hint 1", "Hint 2"],
            "expected_outcome": "Description of what a correct submission looks like, or test cases if coding."
        }}
        """
        response = generate_with_retry(self.llm, prompt)
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            return json.loads(response.strip())
        except Exception as e:
            print(f"Error parsing assignment generation: {e}")
            return {"title": f"Assignment for {topic}", "description": "", "hints": [], "expected_outcome": ""}

    def evaluate_submission(self, assignment_details: dict, submission_content: str, assignment_type: str = "coding") -> dict:
        """
        Evaluates a student's submission against the assignment details.
        """
        prompt = f"""
        You are an grading assistant.
        Evaluate the student's submission for the following assignment.
        
        Assignment Type: {assignment_type}
        Assignment Details: {json.dumps(assignment_details)}
        
        Student Submission:
        {submission_content}
        
        Provide a score from 0.0 to 10.0 and detailed feedback.
        Return ONLY valid JSON in the following format:
        {{
            "score": 8.5,
            "feedback": "Detailed feedback on what was good and what went wrong."
        }}
        """
        response = generate_with_retry(self.llm, prompt)
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            return json.loads(response.strip())
        except Exception as e:
            print(f"Error evaluating submission: {e}")
            return {"score": 0.0, "feedback": "Evaluation failed."}
