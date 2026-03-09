from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models, schemas


def get_students(db: Session, skip: int = 0, limit: int = 100, name: str | None = None):
    query = db.query(models.Student)
    if name:
        query = query.filter(models.Student.name.ilike(f"%{name}%"))
    return query.offset(skip).limit(limit).all()


def get_student(db: Session, student_id: str):
    return db.query(models.Student).filter(models.Student.student_id == student_id).first()


def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


def update_student(db: Session, student_id: str, student: schemas.StudentCreate):
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student


def delete_student(db: Session, student_id: str):
    db_student = get_student(db, student_id)
    if not db_student:
        return None
    db.delete(db_student)
    db.commit()
    return db_student


def get_classes(db: Session):
    return db.query(models.Class).all()


def get_class(db: Session, class_id: str):
    return db.query(models.Class).filter(models.Class.class_id == class_id).first()


def create_class(db: Session, class_obj: schemas.ClassCreate):
    db_class = models.Class(**class_obj.dict())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


def stats(db: Session):
    total = db.query(func.count(models.Student.id)).scalar() or 0
    avg_gpa = db.query(func.avg(models.Student.gpa)).scalar() or 0
    by_major = (
        db.query(models.Student.major, func.count(models.Student.id))
        .group_by(models.Student.major)
        .all()
    )
    return {"total": total, "avg_gpa": avg_gpa, "by_major": dict(by_major)}
