from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="student") # student or teacher
    
    courses = relationship("Course", back_populates="teacher")
    enrollments = relationship("Enrollment", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    
    teacher = relationship("User", back_populates="courses")
    topics = relationship("Topic", back_populates="course")
    enrollments = relationship("Enrollment", back_populates="course")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    attendances = relationship("Attendance", back_populates="enrollment")

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    course = relationship("Course", back_populates="topics")
    assignments = relationship("Assignment", back_populates="topic")
    quiz_results = relationship("QuizResult", back_populates="topic")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    difficulty = Column(String) # easy, medium, hard
    topic_id = Column(Integer, ForeignKey("topics.id"))
    deadline = Column(DateTime)
    
    topic = relationship("Topic", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    content = Column(String) # code or text
    score = Column(Float, nullable=True)
    feedback = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    assignment = relationship("Assignment", back_populates="submissions")

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    score = Column(Float)
    total = Column(Integer)
    feedback = Column(JSON, nullable=True)
    taken_at = Column(DateTime, default=datetime.utcnow)
    
    topic = relationship("Topic", back_populates="quiz_results")

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"))
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String) # present, absent, late
    
    enrollment = relationship("Enrollment", back_populates="attendances")
