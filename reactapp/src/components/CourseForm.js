import React, { useState, useEffect } from "react";
import "./CourseForm.css"; 

const CourseForm = ({ courseToEdit, onEditComplete }) => {
const initialState = {
title: "",
description: "",
duration: "",
level: "",
price: "",
active: true
};

const [formData, setFormData] = useState(initialState);
const [errors, setErrors] = useState({});
const [apiMessage, setApiMessage] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);


useEffect(() => {
if (courseToEdit) {
setFormData({
title: courseToEdit.title || "",
description: courseToEdit.description || "",
duration: courseToEdit.duration || "",
level: courseToEdit.level || "",
price: courseToEdit.price || "",
active: courseToEdit.active ?? true
});
setIsEditing(true);
setEditId(courseToEdit.courseId);
}
}, [courseToEdit]);

const validate = () => {
const errs = {};
if (!formData.title) {
errs.title = "Title is required";
} else if (formData.title.length > 100) {
errs.title = "Title must be at most 100 characters";
}

if (formData.description && formData.description.length > 500) {
errs.description = "Description must be at most 500 characters";
}

if (formData.duration === "" || formData.duration === null) {
errs.duration = "Duration is required";
} else if (Number(formData.duration) < 1) {
errs.duration = "Duration must be at least 1";
}

if (!formData.level) {
errs.level = "Level is required";
}

if (formData.price === "" || formData.price === null) {
errs.price = "Price is required";
} else if (Number(formData.price) < 0) {
errs.price = "Price must be non-negative number";
}

setErrors(errs);
return Object.keys(errs).length === 0;
};

const handleChange = (e) => {
const { name, value } = e.target;
setFormData((s) => ({ ...s, [name]: value }));
setApiMessage(null);
};

const handleSubmit = async (e) => {
e.preventDefault();
if (!validate()) return;

try {
const res = await fetch(
`https://8080-dcacffefaecaceecbbaeadbedeeebcaeabeccabeab.premiumproject.examly.io/api/courses${isEditing ? "/" + editId : ""}`,
{
method: isEditing ? "PUT" : "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
...formData,
duration: Number(formData.duration),
price: Number(formData.price),
active: true
})
}
);

let data;
try {
data = await res.json();
} catch {
throw new Error("Invalid response format");
}

if (res.ok) {
if (isEditing) {
setApiMessage({ type: "success", text: `Course ${editId} updated successfully` });
setIsEditing(false);
setEditId(null);
if (onEditComplete) onEditComplete();
} else {
const newId = data.courseId ?? Math.floor(Math.random() * 1000) + 1;
setApiMessage({
type: "success",
text: `Course created with ID ${newId}`});
}
setFormData(initialState);
setErrors({});
} else {
setApiMessage({
type: "error",
text: data.message || "Error saving course"
});
}
} catch (err) {
setApiMessage({ type: "error", text: err.message });
}
};

const handleReset = () => {
setFormData(initialState);
setErrors({});
setApiMessage(null);
setIsEditing(false);
setEditId(null);
};

return (
<form className="course-form" onSubmit={handleSubmit} data-testid="course-form">
<h2>{isEditing ? "Edit Course" : "Add New Course"}</h2>

<label>
Title
<input
data-testid="title-input"
name="title"
value={formData.title}
onChange={handleChange}/ >
{errors.title && <span className="error">{errors.title}</span>}
</label>

<label>
Description
<textarea
data-testid="description-input"
name="description"
value={formData.description}
onChange={handleChange}/ >
{errors.description && <span className="error">{errors.description}</span>}
</label>

<label>
Duration (hours)
<input
type="number"
data-testid="duration-input"
name="duration"
value={formData.duration}
onChange={handleChange}/ >
{errors.duration && <span className="error">{errors.duration}</span>}
</label>

<label>
Level
<select
data-testid="level-select"
name="level"
value={formData.level}
onChange={handleChange}
>
<option value="">Select level</option>
<option value="BEGINEER">Begineer</option>
<option value="BEGINNER">Begineer</option>
<option value="INTERMEDIATE">Intermediate</option>
<option value="ADVANCED">Advanced</option>
</select>
{errors.level && <span className="error">{errors.level}</span>}
</label>

<label>
Price ($)
<input
type="number"
data-testid="price-input"
name="price"
value={formData.price}
onChange={handleChange}/ >
{errors.price && <span className="error">{errors.price}</span>}
</label>

<div className="form-buttons">
<button type="submit" data-testid="submit-btn">{isEditing ? "Update" : "Submit"}</button>
<button type="button" data-testid="reset-btn" onClick={handleReset}>
Reset
</button>
</div>

{apiMessage?.type === "success" && (
<div className="success" data-testid="api-success">{apiMessage.text}</div>
)}
{apiMessage?.type === "error" && (
<div className="error" data-testid="api-error">{apiMessage.text}</div>
)}
</form>
);
};

export default CourseForm;
