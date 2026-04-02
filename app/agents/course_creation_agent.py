from app.services.llm_service import get_llm, generate_with_retry
import json

class CourseCreationAgent:
    def __init__(self):
        self.llm = get_llm("gemini-2.5-flash")
    
    def generate_course_structure(self, subject: str, duration: str, context: str = "") -> dict:
        prompt = f"""
        You are an expert Course Creator for an Agentic Classroom.
        Create a detailed course structure for the subject '{subject}' designed for a duration of '{duration}'.
        
        Additional context/syllabus provided: {context}

        Divide the course into logical modules and topics.
        Return ONLY valid JSON in the following format:
        {{
            "course": "{subject}",
            "modules": [
                {{
                    "title": "Module Name",
                    "description": "Brief module overview",
                    "topics": [
                        {{"title": "Topic Name", "description": "Topic details", "prerequisites": ["List of prerequisite concepts"]}}
                    ]
                }}
            ]
        }}
        """
        response = generate_with_retry(self.llm, prompt)
        try:
            # Extract json if wrapped in backticks
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            return json.loads(response.strip())
        except Exception as e:
            print(f"Error parsing course structure: {e}")
            return {"course": subject, "modules": []}
