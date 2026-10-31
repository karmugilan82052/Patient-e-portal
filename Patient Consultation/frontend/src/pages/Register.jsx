import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        councilId: ''
    });

    const councils = [
        { name: 'Junction', code: 'Junction' },
        { name: '5-Roads', code: '5-Roads' },
        { name: 'Omalur', code: 'Omalur' },
        { name: 'Hastampatti', code: 'Hastampatti' },
        { name: '4-Roads', code: '4-Roads' },
        { name: 'SB-Colony', code: 'SB-Colony' },
        { name: 'HQ-Admin', code: 'HQ-Admin' }
    ];
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
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card auth-card">
            <div className="auth-header">
                <div className="auth-logo-circle">
                    <span>🏥</span>
                </div>
                <h1>Create Account</h1>
                <p className="auth-subtitle">Register as a patient, doctor, or administrator</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        onChange={handleChange}
                    />
                </div>
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
                        placeholder="At least 6 characters"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Account Role</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="USER">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Medical/Professional Council</label>
                    <select name="councilId" value={formData.councilId} onChange={handleChange} required>
                        <option value="">Select a Council</option>
                        {councils.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="primary" disabled={submitting}>
                    <span>✚</span> {submitting ? 'Registering...' : 'Complete Registration'}
                </button>
            </form>

            <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;
