import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../utils/api';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const responseData = await apiLogin({ identifier: email, password });
            login(responseData);
            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Invalid email or password.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-container">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email or Username</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="error-text" role="alert">{error}</p>}
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Login'}</button>
                </form>
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register Here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;