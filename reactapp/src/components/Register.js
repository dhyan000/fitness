import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../utils/api';
import './Auth.css'; // Import the new CSS

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('MEMBER');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = { name, username, email, password, role, age: Number(age), phoneNumber };
            await register(userData);
            alert('Registration successful! Please proceed to login.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-container">
                <h2>Create Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>I am a:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="MEMBER">Member</option>
                            <option value="TRAINER">Trainer</option>
                        </select>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit">Register</button>
                </form>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;