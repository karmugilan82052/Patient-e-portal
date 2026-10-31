import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('councilId', res.data.councilId);

            if (res.data.role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (res.data.role === 'DOCTOR') {
                navigate('/doctor-dashboard');
            } else {
                navigate('/create-appointment');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card auth-card">
            <div className="auth-header">
                <div className="auth-logo-circle">
                    <span>🩺</span>
                </div>
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your patient portal account</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="••••••••"
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="primary" disabled={submitting}>
                    <span>🔐</span> {submitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
