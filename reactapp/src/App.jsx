import React, { useState } from "react";
import CourseList from "./components/CourseList";
import CourseForm from "./components/CourseForm";
import "./App.css";

const App = () => {
const [view, setView] = useState("list");
const [editingCourse, setEditingCourse] = useState(null);

const handleEdit = (course) => {
setEditingCourse(course);
setView("form"); 
};

const handleFormSubmit = () => {
setEditingCourse(null);
setView("list"); 
};

return (
<div className="app-container">
<div className="left-panel">
<div className="brand-logo">
<span className="brand-icon">📚</span>
<h2>CourseHub</h2>
</div>
</div>

<div className="right-panel">
<header className="app-header">
<h1>Course Management System</h1>
</header>

<nav className="navbar">
<button
className={
`nav-btn ${view === "list" ? "active" : ""}`}
onClick={() => {
setView("list");
setEditingCourse(null);
}}
data-testid="nav-list"
>
View Courses
</button>
<button
className={
`nav-btn ${view === "form" ? "active" : ""}`}
onClick={() => {
setView("form");
setEditingCourse(null);
}}
data-testid="nav-add"
>
Add Course
</button>
</nav>

<main className="main-content">
{view === "list" && <CourseList onEdit={handleEdit} />}
{view === "form" && (
<CourseForm
courseToEdit={editingCourse}
onEditComplete={handleFormSubmit}
/>
)}
</main>
</div>
</div>
);
};

export default App;
