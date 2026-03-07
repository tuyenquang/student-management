from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Class(Base):
    __tablename__ = "classes"

    class_id = Column(String, primary_key=True, index=True)
    class_name = Column(String, unique=True, index=True)
    advisor = Column(String)

    students = relationship("Student", back_populates="class_")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    birth_year = Column(Integer)
    major = Column(String)
    gpa = Column(Float)
    class_id = Column(String, ForeignKey("classes.class_id"), nullable=True)

    class_ = relationship("Class", back_populates="students")
