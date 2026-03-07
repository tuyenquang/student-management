const API_BASE = "http://localhost:8000";

function App() {
  const [students, setStudents] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [form, setForm] = React.useState({
    student_id: "",
    name: "",
    birth_year: "",
    major: "",
    gpa: "",
    class_id: ""
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
      setForm({ student_id: "", name: "", birth_year: "", major: "", gpa: "" });
      setEditing(false);
      fetchStudents();
    } else {
      const err = await res.json();
      alert(err.detail || 'Error');
    }
  };

  const handleEdit = student => {
    setForm(student);
    setEditing(true);
  };

  const handleDelete = async student_id => {
    if (!confirm('Delete this student?')) return;
    await fetch(`${API_BASE}/students/${student_id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div>
      <h1>Student Management</h1>
      {stats && (
        <div style={{ marginBottom: '20px' }}>
          <strong>Total:</strong> {stats.total} &nbsp;
          <strong>Avg GPA:</strong> {stats.avg_gpa.toFixed(2)} &nbsp;
          <strong>By major:</strong> {Object.entries(stats.by_major).map(([m,c])=>`${m}:${c}`).join(', ')}
          <button style={{ marginLeft: '20px' }} onClick={async ()=>{
              const res = await fetch(`${API_BASE}/students/export`);
              const data = await res.json();
              const blob = new Blob([data.content], {type: 'text/csv'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'students.csv';
              a.click();
          }}>Export CSV</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Major</th>
            <th>GPA</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.major}</td>
              <td>{s.gpa}</td>
              <td>{classes.find(c=>c.class_id===s.class_id)?.class_name || s.class_id}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>{' '}
                <button onClick={() => handleDelete(s.student_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{editing ? 'Edit' : 'Add'} Student</h2>
      <div className="form-group">
        <label>Search by name:</label>
        <input value={searchName} onChange={e => setSearchName(e.target.value)} />
        <button type="button" onClick={() => fetchStudents(searchName)}>Search</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student ID:</label>
          <input name="student_id" value={form.student_id} onChange={handleChange} required disabled={editing} />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Birth Year:</label>
          <input name="birth_year" type="number" value={form.birth_year} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Major:</label>
          <input name="major" value={form.major} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>GPA:</label>
          <input name="gpa" type="number" step="0.01" value={form.gpa} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Class:</label>
          <select name="class_id" value={form.class_id} onChange={handleChange}>
            <option value="">-- none --</option>
            {classes.map(c => (
              <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
            ))}
          </select>
        </div>
        <button type="submit">{editing ? 'Update' : 'Add'} Student</button>
      <button type="button" onClick={() => { setEditing(false); setForm({ student_id: "", name: "", birth_year: "", major: "", gpa: "", class_id: "" }); }}>Clear</button>
      </form>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));