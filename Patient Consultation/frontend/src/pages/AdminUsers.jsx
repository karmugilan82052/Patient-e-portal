import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Search and Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const currentUserId = localStorage.getItem('userId');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch users', err);
            setError('Failed to fetch user directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}`, { role: newRole });
            setMessage(`✓ User role updated to ${newRole}`);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user role');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/admin/users/${userId}`);
            setMessage(`✓ User "${userName}" deleted successfully`);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const filteredUsers = useMemo(() => {
        let list = [...users];

        if (roleFilter !== 'ALL') {
            list = list.filter(u => u.role === roleFilter);
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(u =>
                (u.name && u.name.toLowerCase().includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.councilId && u.councilId.toLowerCase().includes(q))
            );
        }

        return list;
    }, [users, roleFilter, searchTerm]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading user directory...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div className="page-header-wrapper">
                <h1 className="page-heading">User Directory & Role Management</h1>
                <span className="badge-count">{users.length} Registered Accounts</span>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Filter toolbar */}
            <div className="search-filter-container" style={{ marginTop: '1.5rem' }}>
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by user name, email, or council..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="btn-clear-search" onClick={() => setSearchTerm('')}>
                            ✕
                        </button>
                    )}
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label className="filter-label">Filter Role:</label>
                        <select
                            className="filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="ALL">All Roles</option>
                            <option value="USER">Patients Only</option>
                            <option value="DOCTOR">Doctors Only</option>
                            <option value="ADMIN">Admins Only</option>
                        </select>
                    </div>
                </div>

                <div className="search-results-count">
                    Showing <strong>{filteredUsers.length}</strong> of {users.length} users
                </div>
            </div>

            <table className="history-table" style={{ marginTop: '1.25rem' }}>
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Council</th>
                        <th>Current Role</th>
                        <th>Role Action</th>
                        <th style={{ textAlign: 'center' }}>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                <p style={{ fontSize: '1.05rem' }}>🔍 No users found matching this filter.</p>
                            </td>
                        </tr>
                    ) : (
                        filteredUsers.map((u) => {
                            const isSelf = u.userId === currentUserId;
                            return (
                                <tr key={u.userId}>
                                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{u.role === 'DOCTOR' ? '🩺' : u.role === 'ADMIN' ? '👑' : '👤'}</span>
                                            <span>{u.name}</span>
                                            {isSelf && <span className="badge-count" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>You</span>}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                    <td>
                                        <span style={{ background: '#f8fafc', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.82rem', fontWeight: 600 }}>
                                            {u.councilId || '5-Roads'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`role-tag role-${u.role ? u.role.toLowerCase() : 'user'}`}>
                                            {u.role === 'USER' ? 'Patient' : u.role === 'DOCTOR' ? 'Doctor' : 'Admin'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="role-change-select"
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                                            disabled={isSelf}
                                            title={isSelf ? 'Cannot change your own role' : 'Promote or demote user'}
                                        >
                                            <option value="USER">Patient</option>
                                            <option value="DOCTOR">Doctor</option>
                                            <option value="ADMIN">Administrator</option>
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {!isSelf ? (
                                            <button
                                                className="btn-delete-user"
                                                onClick={() => handleDeleteUser(u.userId, u.name)}
                                                title="Delete user account"
                                            >
                                                🗑️ Delete
                                            </button>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Active</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;

