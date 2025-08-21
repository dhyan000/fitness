import React, { useEffect, useState } from "react";
import "./CourseList.css";

const API_BASE =
"https://8080-dcacffefaecaceecbbaeadbedeeebcaeabeccabeab.premiumproject.examly.io/api";

const CourseList = ({ onEdit }) => {
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [activeOnly, setActiveOnly] = useState(false);

const [priceMin, setPriceMin] = useState("");
const [priceMax, setPriceMax] = useState("");
const [durationMin, setDurationMin] = useState("");
const [durationMax, setDurationMax] = useState("");

const load = async (filters = {}) => {
setLoading(true);
setError(null);
try {
const params = new URLSearchParams();
if (filters.active) params.append("active", "true");
if (filters.priceMin) params.append("priceMin", filters.priceMin);
if (filters.priceMax) params.append("priceMax", filters.priceMax);
if (filters.durationMin) params.append("durationMin", filters.durationMin);
if (filters.durationMax) params.append("durationMax", filters.durationMax);

params.append("page",0);
params.append("size",1000);
const url = `${API_BASE}/courses?${params.toString()}`;
const res = await fetch(url);

if (!res.ok) {
try {
const body = await res.json();
throw new Error(body.message || `Failed to fetch (${res.status})`);
} catch {
const txt = await res.text().catch(() => null);
throw new Error(txt || `Failed to fetch (${res.status})`);
}
}

const data = await res.json();
setCourses(data || []);
} catch (err) {
setError(err.message || "Fetch error");
setCourses([]);
} finally {
setLoading(false);
}
};

useEffect(() => {
load({});
}, []);

const toggleActiveFilter = () => {
const newFlag = !activeOnly;
setActiveOnly(newFlag);
load({
active: newFlag,
priceMin,
priceMax,
durationMin,
durationMax,
});
};

const applyRangeFilters = () => {
load({
active: activeOnly,
priceMin,
priceMax,
durationMin,
durationMax,
});
};

const handleDelete = async (id) => {
if (!window.confirm("Are you sure you want to delete this course?")) return;
try {
const res = await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
if (!res.ok) throw new Error(`Delete failed (${res.status})`);
setCourses((prev) => prev.filter((c) => c.courseId !== id));
} catch (err) {
alert(err.message || "Error deleting course");
}
};

return (
<div className="course-list-container">
<div className="filter-controls">
<button
className="filter-button"
data-testid="active-filter"
onClick={toggleActiveFilter}
>
{activeOnly ? "Show All Courses" : "Show Active Only"}
</button>

<div className="range-filters">
<div>
<label>Price Min: </label>
<input
type="number"
value={priceMin}
onChange={(e) => setPriceMin(e.target.value)}
placeholder="Min"/ >
</div>
<div>
<label>Price Max: </label>
<input
type="number"
value={priceMax}
onChange={(e) => setPriceMax(e.target.value)}
placeholder="Max"/>
</div>
<div>
<label>Duration Min: </label>
<input
type="number"
value={durationMin}
onChange={(e) => setDurationMin(e.target.value)}
placeholder="Min"/>
</div>
<div>
<label>Duration Max: </label>
<input
type="number"
value={durationMax}
onChange={(e) => setDurationMax(e.target.value)}
placeholder="Max"/>
</div>
<button onClick={applyRangeFilters}>Apply Filters</button>
</div>
</div>

{loading && <div data-testid="loading">Loading...</div>}
{error && <div data-testid="error">{error}</div>}
{!loading && !error && courses.length === 0 && (
<div data-testid="empty">No courses available</div>
)}

{!loading && !error && courses.length > 0 && (
<div className="course-grid" data-testid="course-list">
{courses.map((c) => (
<div key={c.courseId} className="course-card" data-testid="course-card">
<img
src='https://lh3.googleusercontent.com/pw/AP1GczNLZccOcu9REMHXa0xtih3blGImGnPUiJg74DATB5h7_5EY5paur4E6stw45AC5lXySKbM_-PBX2NVTFe2qghRpyyeFagWWMpFd0L4f4Hmc2O1vQbI=w2400'
alt="Course"
className="course-image"/>
<h3>{c.title}</h3>
<p>{c.description}</p>
<p><strong>Duration:</strong> {c.duration}</p>
<p><strong>Level:</strong> {c.level}</p>
<p><strong>Price:</strong> ${c.price}</p>
<span
className={`status ${c.isActive ? "status-active" : "status-inactive"}`}
>
{c.isActive ? "✅ Active" : "❌ Inactive"}
</span>

<div className="card-actions">
<button className="edit-btn" onClick={() => onEdit && onEdit(c)}>
✏ Edit
</button>
<button
className="delete-btn"
onClick={() => handleDelete(c.courseId)}
>
🗑 Delete
</button>
</div>
</div>
))}
</div>
)}
</div>
);
};

export default CourseList;
