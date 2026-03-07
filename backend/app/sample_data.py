from . import crud, schemas
from .database import SessionLocal

classes = [
    {"class_id": "C01", "class_name": "Computer Science 1", "advisor": "Nguyen Van A"},
    {"class_id": "C02", "class_name": "Mathematics 1", "advisor": "Tran Thi B"},
]

students = [
    {"student_id": "S001", "name": "Alice", "birth_year": 2000, "major": "Computer Science", "gpa": 3.5, "class_id": "C01"},
    {"student_id": "S002", "name": "Bob", "birth_year": 1999, "major": "Mathematics", "gpa": 3.7, "class_id": "C02"},
    {"student_id": "S003", "name": "Charlie", "birth_year": 2001, "major": "Physics", "gpa": 3.2, "class_id": "C01"},
]


def load():
    db = SessionLocal()
    for c in classes:
        existing = crud.get_class(db, c["class_id"])
        if not existing:
            crud.create_class(db, schemas.ClassCreate(**c))
    for s in students:
        existing = crud.get_student(db, s["student_id"])
        if not existing:
            crud.create_student(db, schemas.StudentCreate(**s))
    db.close()

if __name__ == "__main__":
    load()
    print("Sample data loaded")
