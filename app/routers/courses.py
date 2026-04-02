from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Course, Topic, User, Enrollment
from pydantic import BaseModel
from app.agents.course_creation_agent import CourseCreationAgent
from app.routers.auth import get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])
course_agent = CourseCreationAgent()

class CourseCreate(BaseModel):
    title: str
    description: str
    duration: str = "4 weeks"
    syllabus_context: str = ""

@router.get("/")
def get_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "teacher":
        courses = db.query(Course).filter(Course.teacher_id == current_user.id).all()
    else:
        enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
        courses = [e.course for e in enrollments]
    return courses

@router.post("/")
def create_course(course: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create courses")

    # Save initial course
    db_course = Course(title=course.title, description=course.description, teacher_id=current_user.id)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    # Use Agent to generate structure
    structure = course_agent.generate_course_structure(course.title, course.duration, course.syllabus_context)
    
    # Save topics based on agent output
    for module in structure.get("modules", []):
        for topic in module.get("topics", []):
            db_topic = Topic(title=topic["title"], description=topic["description"], course_id=db_course.id)
            db.add(db_topic)
    
    db.commit()
    return {"message": "Course created successfully", "course_id": db_course.id, "structure": structure}

@router.get("/{course_id}/topics")
def get_course_topics(course_id: int, db: Session = Depends(get_db)):
    topics = db.query(Topic).filter(Topic.course_id == course_id).all()
    return topics

@router.post("/{course_id}/enroll")
def enroll_student(course_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can enroll")
    
    existing = db.query(Enrollment).filter(Enrollment.student_id == current_user.id, Enrollment.course_id == course_id).first()
    if existing:
        return {"message": "Already enrolled"}

    enrollment = Enrollment(student_id=current_user.id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully"}
