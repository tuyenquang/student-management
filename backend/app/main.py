from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import SessionLocal, engine
from . import sample_data

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    sample_data.load()

# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    existing = crud.get_student(db, student.student_id)
    if existing:
        raise HTTPException(status_code=400, detail="Student ID already registered")
    return crud.create_student(db, student)


@app.get("/students/", response_model=list[schemas.Student])
def list_students(
    skip: int = 0,
    limit: int = 100,
    name: str | None = None,
    db: Session = Depends(get_db),
):
    return crud.get_students(db, skip=skip, limit=limit, name=name)




@app.get("/students/export")
def export_students(db: Session = Depends(get_db)):
    students = crud.get_students(db, skip=0, limit=10000)
    import csv, io
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["student_id", "name", "birth_year", "major", "gpa", "class_id"])
    for s in students:
        writer.writerow([s.student_id, s.name, s.birth_year, s.major, s.gpa, s.class_id])
    return {
        "content": output.getvalue(),
        "mime": "text/csv",
    }


@app.get("/students/{student_id}", response_model=schemas.Student)
def read_student(student_id: str, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student


@app.put("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: str, student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.update_student(db, student_id, student)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student


@app.delete("/students/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    result = crud.delete_student(db, student_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"detail": "Deleted"}


# class endpoints
@app.get("/classes/", response_model=list[schemas.Class])
def list_classes(db: Session = Depends(get_db)):
    return crud.get_classes(db)


@app.post("/classes/", response_model=schemas.Class)
def create_class(class_obj: schemas.ClassCreate, db: Session = Depends(get_db)):
    existing = crud.get_class(db, class_obj.class_id)
    if existing:
        raise HTTPException(status_code=400, detail="Class ID already exists")
    return crud.create_class(db, class_obj)


@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    return crud.stats(db)


