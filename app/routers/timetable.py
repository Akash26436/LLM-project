from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.agents.timetable_agent import TimetableAgent
from app.routers.auth import get_current_user
from app.database.models import User

router = APIRouter(prefix="/timetable", tags=["timetable"])
timetable_agent = TimetableAgent()

class ScheduleClass(BaseModel):
    course_id: int
    start_time: str
    end_time: str

@router.post("/schedule")
def schedule_session(req: ScheduleClass, current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can schedule")
    
    result = timetable_agent.schedule_class(req.course_id, current_user.id, req.start_time, req.end_time)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.get("/")
def get_my_schedule(current_user: User = Depends(get_current_user)):
    return timetable_agent.get_schedule(current_user.id, current_user.role)
