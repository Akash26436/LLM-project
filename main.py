from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.models import Base
from app.database.session import engine

from app.routers import auth, courses, assignments, quizzes, attendance, analytics, doubts, timetable

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Agentic Classroom API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(assignments.router)
app.include_router(quizzes.router)
app.include_router(attendance.router)
app.include_router(analytics.router)
app.include_router(doubts.router)
app.include_router(timetable.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Agentic Classroom API"}
