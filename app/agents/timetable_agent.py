class TimetableAgent:
    """
    TimetableAgent schedules classes and prevents overlap.
    A very simplified simulation for the Classroom Platform.
    """
    def __init__(self):
        self.schedule = [] # Simulated in-memory scheduling.

    def schedule_class(self, course_id: int, teacher_id: int, start_time: str, end_time: str):
        # Basic overlap check simulation
        for session in self.schedule:
            if session["teacher_id"] == teacher_id and session["start_time"] < end_time and session["end_time"] > start_time:
                return {"status": "error", "message": "Teacher has a scheduling conflict."}
        
        session = {
            "course_id": course_id,
            "teacher_id": teacher_id,
            "start_time": start_time,
            "end_time": end_time
        }
        self.schedule.append(session)
        return {"status": "success", "message": "Class scheduled successfully.", "session": session}
        
    def get_schedule(self, role_id: int, role: str = "teacher"):
        if role == "teacher":
            return [s for s in self.schedule if s["teacher_id"] == role_id]
        return self.schedule
