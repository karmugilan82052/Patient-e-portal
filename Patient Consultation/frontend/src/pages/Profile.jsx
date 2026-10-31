import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        password: '',
        councilId: '',
        bloodGroup: '',
        allergies: '',
        age: '',
        gender: '',
        emergencyContact: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const councils = [
        { name: 'Junction', code: 'Junction' },
        { name: '5-Roads', code: '5-Roads' },
        { name: 'Omalur', code: 'Omalur' },
        { name: 'Hastampatti', code: 'Hastampatti' },
        { name: '4-Roads', code: '4-Roads' },
        { name: 'SB-Colony', code: 'SB-Colony' }
    ];

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setProfile(res.data);
            setEditData({
                password: '',
                councilId: res.data.councilId || '',
                bloodGroup: res.data.bloodGroup || '',
                allergies: res.data.allergies || '',
                age: res.data.age || '',
                gender: res.data.gender || '',
                emergencyContact: res.data.emergencyContact || ''
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setMessage('');
        setError('');
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {};
            if (editData.password) dataToSubmit.password = editData.password;
            if (editData.councilId) dataToSubmit.councilId = editData.councilId;
            dataToSubmit.bloodGroup = editData.bloodGroup;
            dataToSubmit.allergies = editData.allergies;
            dataToSubmit.age = editData.age;
            dataToSubmit.gender = editData.gender;
            dataToSubmit.emergencyContact = editData.emergencyContact;

            await api.put('/auth/profile', dataToSubmit);

            if (editData.councilId) localStorage.setItem('councilId', editData.councilId);

            setMessage('✓ Health profile updated successfully!');
            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading health profile...
            </div>
        );
    }
    if (!profile) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Error loading profile</div>;

    const initial = (profile.name?.charAt(0) || 'U').toUpperCase();

    return (
        <div className="card profile-card" style={{ maxWidth: '680px' }}>
            <div className="profile-header-wrapper">
                <div className="profile-avatar-large">
                    <span>{profile.role === 'DOCTOR' ? '🩺' : initial}</span>
                </div>
                <h1>{profile.role === 'DOCTOR' ? 'Doctor Profile' : 'Patient Health Profile'}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {profile.role === 'DOCTOR'
                        ? 'Certified Medical Consultant Credentials'
                        : 'Personal Health Records & Clinical Information'}
                </p>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {!isEditing ? (
                <>
                    {/* Account Info Section */}
                    <div className="profile-section-card">
                        <h3 className="profile-section-title">👤 Account Details</h3>
                        <div className="profile-item">
                            <span className="profile-label">Full Name</span>
                            <span className="profile-val">{profile.name}</span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Email Address</span>
                            <span className="profile-val">{profile.email}</span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Account Role</span>
                            <span className="role-pill-badge">
                                {profile.role === 'USER' ? 'Patient' : 'Doctor'}
                            </span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Medical Council</span>
                            <span className="profile-val" style={{ fontWeight: 700, color: '#064e3b' }}>
                                {profile.councilId || '5-Roads'}
                            </span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Member Since</span>
                            <span className="profile-val">
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Extended Health Vitals (Particularly for Patients) */}
                    <div className="profile-section-card" style={{ marginTop: '1.5rem' }}>
                        <h3 className="profile-section-title">🩺 Health Vitals & Clinical Info</h3>
                        <div className="profile-item">
                            <span className="profile-label">Blood Group</span>
                            <span className="profile-val badge-blood">
                                {profile.bloodGroup || 'Not specified'}
                            </span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Known Allergies</span>
                            <span className="profile-val">
                                {profile.allergies || 'None recorded'}
                            </span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Age</span>
                            <span className="profile-val">
                                {profile.age ? `${profile.age} years old` : 'Not specified'}
                            </span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Gender</span>
                            <span className="profile-val">
                                {profile.gender || 'Not specified'}
                            </span>
                        </div>
                        <div className="profile-item">
                            <span className="profile-label">Emergency Contact</span>
                            <span className="profile-val" style={{ color: '#b91c1c', fontWeight: 600 }}>
                                {profile.emergencyContact || 'Not specified'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleEditToggle}
                        className="primary"
                        style={{ marginTop: '2rem' }}
                    >
                        <span>✏️</span> Edit Profile & Health Vitals
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                    <h3 className="profile-section-title">✏️ Edit Account Settings</h3>
                    <div className="form-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            name="password"
                            value={editData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <div className="form-group">
                        <label>Medical/Professional Council</label>
                        <select
                            name="councilId"
                            value={editData.councilId}
                            onChange={handleChange}
                            required
                        >
                            {councils.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <h3 className="profile-section-title" style={{ marginTop: '1.5rem' }}>
                        🩺 Medical Vitals & Emergency Details
                    </h3>
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={editData.bloodGroup}
                                onChange={handleChange}
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroups.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                min="1"
                                max="120"
                                value={editData.age}
                                onChange={handleChange}
                                placeholder="e.g. 28"
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={editData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                {genders.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Emergency Contact Phone</label>
                            <input
                                type="tel"
                                name="emergencyContact"
                                value={editData.emergencyContact}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Known Allergies (Medication/Food/Environment)</label>
                        <input
                            type="text"
                            name="allergies"
                            value={editData.allergies}
                            onChange={handleChange}
                            placeholder="e.g. Penicillin, Peanuts, Sulfa drugs (or 'None')"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '2rem' }}>
                        <button type="submit" className="primary" style={{ flex: 1 }}>
                            <span>✓</span> Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="secondary"
                            style={{
                                flex: 1,
                                padding: '0.85rem',
                                border: '1.5px solid #cbd5e1',
                                borderRadius: '10px',
                                background: '#f8fafc',
                                color: '#475569',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
