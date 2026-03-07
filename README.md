# Student Management Web App

## Thông tin cá nhân
- **Họ tên:** [Bùi Quang Tuyến]
- **MSSV:** ["23707921"]

## Tech Stack
- **Backend:** FastAPI + SQLite (SQLAlchemy ORM)
- **Frontend:** React 18 (via CDN) + Babel Standalone
- **Database:** SQLite (`students.db`)
- **Tools:** Kilo Code (AI Coding Agent), VS Code, Live Server

## Tính năng

### Phần 1 — MVP
- ✅ Thêm sinh viên
- ✅ Xem danh sách sinh viên (bảng: ID, Name, Major, GPA, Action)
- ✅ Sửa thông tin sinh viên
- ✅ Xóa sinh viên

### Phần 2 — Mở rộng
- ✅ Thêm bảng lớp học (Class: class_id, class_name, advisor)
- ✅ Sinh viên thuộc một lớp (class_id)
- ✅ Tìm kiếm sinh viên theo tên
- ✅ Thống kê: tổng số sinh viên, GPA trung bình, số sinh viên theo ngành
- ✅ Xuất dữ liệu ra CSV

## Cấu trúc dự án
```
baitap_07_03_2026/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py        # FastAPI routes
│       ├── models.py      # SQLAlchemy models
│       ├── schemas.py     # Pydantic schemas
│       ├── crud.py        # Database operations
│       ├── database.py    # DB connection
│       └── sample_data.py # Dữ liệu mẫu
├── frontend/
│   ├── index.html         # Entry point
│   └── app.js             # React app
├── data/
│   └── sample_students.csv  # File CSV dữ liệu mẫu
└── README.md
```

## Cách chạy

### Backend
```bash
# Cài dependencies
pip install -r backend/requirements.txt

# Chạy server (tự động load dữ liệu mẫu khi khởi động)
uvicorn backend.app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### Frontend
Mở `frontend/index.html` bằng **Live Server** trong VS Code (hoặc bất kỳ HTTP server nào).

## File dữ liệu mẫu
`data/sample_students.csv` — chứa 3 sinh viên mẫu (Alice, Bob, Charlie) dùng để seed database.

## Log quá trình thực hiện

### Phần 1 — MVP (v1.0)
- Tạo backend FastAPI với SQLite, models Student, CRUD endpoints
- Tạo frontend React với bảng danh sách và form thêm/sửa/xóa sinh viên

### Phần 2 — Mở rộng (v2.0)
- Thêm bảng Class, liên kết Student → Class
- Thêm endpoint tìm kiếm theo tên
- Thêm endpoint thống kê (total, avg GPA, by major)
- Thêm endpoint export CSV
- Thêm CORS middleware để frontend có thể gọi API
- Thêm auto-load sample data khi server khởi động
- Sửa Babel từ v6 → v7 để load file JSX ngoài
