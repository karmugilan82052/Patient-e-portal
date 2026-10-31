import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StatCards from '../components/StatCards';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch admin stats', err);
            setError('Failed to load system statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading admin analytics & system overview...
            </div>
        );
    }

    const statItems = [
        {
            label: 'Total Platform Users',
            value: stats?.totalUsers || 0,
            icon: '👥',
            variant: 'blue',
            subtext: `${stats?.totalPatients || 0} Patients, ${stats?.totalDoctors || 0} Doctors`
        },
        {
            label: 'Total Consultations',
            value: stats?.totalAppointments || 0,
            icon: '📋',
            variant: 'orange',
            subtext: `${stats?.pendingAppointments || 0} Pending, ${stats?.confirmedAppointments || 0} Confirmed`
        },
        {
            label: 'Active Doctors',
            value: stats?.totalDoctors || 0,
            icon: '🩺',
            variant: 'green',
            subtext: 'Across all councils'
        },
        {
            label: 'Gross Platform Revenue',
            value: `₹${stats?.totalRevenue || 0}`,
            icon: '💳',
            variant: 'green',
            subtext: '₹200 per confirmed consult'
        }
    ];

    return (
        <div className="admin-container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <div className="page-header-wrapper">
                <h1 className="page-heading">Platform Administration</h1>
                <span className="badge-count" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                    👑 Super Admin
                </span>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Global Stat Cards */}
            <StatCards items={statItems} />

            {/* Quick Actions Bar */}
            <div className="admin-quick-actions" style={{ marginTop: '2rem' }}>
                <Link to="/admin-users" className="admin-action-card">
                    <div className="action-card-icon">👥</div>
                    <div>
                        <h3>Manage Users</h3>
                        <p>View, promote roles (Doctor / Patient / Admin), and manage councils</p>
                    </div>
                </Link>

                <Link to="/admin-appointments" className="admin-action-card">
                    <div className="action-card-icon">📋</div>
                    <div>
                        <h3>All Consultations</h3>
                        <p>View, monitor, and inspect all patient consultation requests</p>
                    </div>
                </Link>
            </div>

            {/* Council Distribution Breakdown */}
            <div className="card" style={{ maxWidth: '100%', marginTop: '2rem', padding: '1.75rem 2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#064e3b', marginBottom: '1rem' }}>
                    🏥 Regional Council Distribution
                </h2>

                {(!stats?.councilBreakdown || stats.councilBreakdown.length === 0) ? (
                    <p style={{ color: 'var(--text-muted)' }}>No council data available yet.</p>
                ) : (
                    <div className="council-grid">
                        {stats.councilBreakdown.map((c) => (
                            <div key={c.name} className="council-card">
                                <div className="council-card-header">
                                    <span className="council-badge">Council</span>
                                    <h4>{c.name}</h4>
                                </div>
                                <div className="council-stats-row">
                                    <div>
                                        <span className="stat-sm-label">Total</span>
                                        <strong>{c.total}</strong>
                                    </div>
                                    <div>
                                        <span className="stat-sm-label">Pending</span>
                                        <strong style={{ color: '#b45309' }}>{c.pending}</strong>
                                    </div>
                                    <div>
                                        <span className="stat-sm-label">Confirmed</span>
                                        <strong style={{ color: '#047857' }}>{c.confirmed}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* System Information Card */}
            <div className="card" style={{ maxWidth: '100%', marginTop: '1.5rem', padding: '1.5rem 2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.75rem' }}>
                    ⚙️ Platform Configuration
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                    <div>
                        <span style={{ color: 'var(--text-muted)' }}>Environment:</span>{' '}
                        <strong>Serverless Offline (Local Emulation)</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)' }}>Database:</span>{' '}
                        <strong>Amazon DynamoDB / Local JSON DB</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)' }}>Notification Service:</span>{' '}
                        <strong>Amazon SES (Simple Email Service)</strong>
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)' }}>Security:</span>{' '}
                        <strong>JWT Authentication & Role-Based Access Control</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

