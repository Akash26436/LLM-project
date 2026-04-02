from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.agents.doubt_agent import DoubtAgent

router = APIRouter(prefix="/doubts", tags=["doubts"])
doubt_agent = DoubtAgent()

class DoubtQuery(BaseModel):
    query: str
    course_topic: str = None

@router.post("/ask")
def ask_doubt(query_data: DoubtQuery):
    answer = doubt_agent.answer_query(query_data.query, query_data.course_topic)
    return {"query": query_data.query, "answer": answer}
