const API_BASE = "http://localhost:8000";

function App() {
  const [students, setStudents] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [form, setForm] = React.useState({
    student_id: "", name: "", birth_year: "", major: "", gpa: "", class_id: ""
  });
  const [editing, setEditing] = React.useState(false);
  const [searchName, setSearchName] = React.useState("");
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchStats();
  }, []);

  const fetchStudents = async (name) => {
    let url = `${API_BASE}/students/`;
    if (name) url += `?name=${encodeURIComponent(name)}`;
    const res = await fetch(url);
    const data = await res.json();
    setStudents(data);
  };

  const fetchClasses = async () => {
    const res = await fetch(`${API_BASE}/classes/`);
    const data = await res.json();
    setClasses(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/stats/`);
    const data = await res.json();
    setStats(data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_BASE}/students/${form.student_id}` : `${API_BASE}/students/`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      resetForm();
      fetchStudents();
      fetchStats();
    } else {
      const err = await res.json();
      alert(err.detail || 'Error');
    }
  };

  const resetForm = () => {
    setForm({ student_id: "", name: "", birth_year: "", major: "", gpa: "", class_id: "" });
    setEditing(false);
  };

  const handleEdit = student => {
    setForm(student);
    setEditing(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async student_id => {
    if (!confirm('Delete this student?')) return;
    await fetch(`${API_BASE}/students/${student_id}`, { method: 'DELETE' });
    fetchStudents();
    fetchStats();
  };

  const handleExport = async () => {
    const res = await fetch(`${API_BASE}/students/export`);
    const data = await res.json();
    const blob = new Blob([data.content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click();
  };

  const gpaColor = gpa => {
    if (gpa >= 3.5) return '#38a169';
    if (gpa >= 3.0) return '#ed8936';
    return '#e53e3e';
  };

  return (
    <div className="container">
      <h1>Student Management</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="label">Total Students</div>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="label">Average GPA</div>
            <div className="value">{stats.avg_gpa.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="label">Majors</div>
            <div className="value">{Object.keys(stats.by_major).length}</div>
          </div>
        </div>
      )}

      {/* Student Table Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>📋 Student List</h2>
          <button className="btn btn-success" onClick={handleExport}>⬇ Export CSV</button>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input
            placeholder="🔍  Search by name..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchStudents(searchName)}
          />
          <button className="btn btn-primary" onClick={() => fetchStudents(searchName)}>Search</button>
          <button className="btn btn-secondary" onClick={() => { setSearchName(''); fetchStudents(); }}>Clear</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Birth Year</th>
              <th>Major</th>
              <th>GPA</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#aaa', padding: '30px' }}>No students found</td></tr>
            )}
            {students.map(s => (
              <tr key={s.student_id}>
                <td><span className="badge">{s.student_id}</span></td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.birth_year}</td>
                <td>{s.major}</td>
                <td style={{ fontWeight: 700, color: gpaColor(s.gpa) }}>{s.gpa}</td>
                <td>{classes.find(c => c.class_id === s.class_id)?.class_name || s.class_id || '—'}</td>
                <td style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-warning" onClick={() => handleEdit(s)}>✏ Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(s.student_id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Card */}
      <div className="card">
        <h2>{editing ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID</label>
              <input name="student_id" value={form.student_id} onChange={handleChange} required disabled={editing} placeholder="e.g. S004" />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. John Doe" />
            </div>
            <div className="form-group">
              <label>Birth Year</label>
              <input name="birth_year" type="number" value={form.birth_year} onChange={handleChange} required placeholder="e.g. 2001" />
            </div>
            <div className="form-group">
              <label>Major</label>
              <input name="major" value={form.major} onChange={handleChange} required placeholder="e.g. Computer Science" />
            </div>
            <div className="form-group">
              <label>GPA</label>
              <input name="gpa" type="number" step="0.01" min="0" max="4" value={form.gpa} onChange={handleChange} required placeholder="0.00 – 4.00" />
            </div>
            <div className="form-group">
              <label>Class</label>
              <select name="class_id" value={form.class_id} onChange={handleChange}>
                <option value="">— None —</option>
                {classes.map(c => (
                  <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '18px' }}>
            <button type="submit" className="btn btn-primary">
              {editing ? '✔ Update Student' : '＋ Add Student'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>✕ Cancel</button>
          </div>
        </form>
      </div>

      {/* Major breakdown */}
      {stats && Object.keys(stats.by_major).length > 0 && (
        <div className="card">
          <h2>📊 Students by Major</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
            {Object.entries(stats.by_major).map(([major, count]) => (
              <div key={major} style={{
                background: '#f7f8ff', border: '1.5px solid #e9ecff',
                borderRadius: '10px', padding: '14px 20px',
                boxShadow: '0 2px 8px rgba(102,126,234,0.10)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: 700, textTransform: 'uppercase' }}>{major}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a2e', marginTop: '4px' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
