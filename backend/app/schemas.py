from pydantic import BaseModel

class StudentBase(BaseModel):
    student_id: str
    name: str
    birth_year: int
    major: str
    gpa: float
    class_id: str | None = None

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int

    class Config:
        orm_mode = True


class ClassBase(BaseModel):
    class_id: str
    class_name: str
    advisor: str

class ClassCreate(ClassBase):
    pass

class Class(ClassBase):
    class Config:
        orm_mode = True
