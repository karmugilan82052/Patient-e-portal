import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import SearchFilterBar from '../components/SearchFilterBar';
import ConsultationSlipModal from '../components/ConsultationSlipModal';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSlipApp, setSelectedSlipApp] = useState(null);

    // Search, Filter, Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOrder, setSortOrder] = useState('NEWEST');

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/admin/appointments');
            setAppointments(res.data || []);
        } catch (err) {
            console.error('Failed to fetch admin appointments', err);
            setError('Failed to fetch consultations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const filteredAppointments = useMemo(() => {
        let list = [...appointments];

        if (statusFilter !== 'ALL') {
            list = list.filter(app => app.status === statusFilter);
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(app =>
                (app.patientName && app.patientName.toLowerCase().includes(q)) ||
                (app.doctorName && app.doctorName.toLowerCase().includes(q)) ||
                (app.symptoms && app.symptoms.toLowerCase().includes(q)) ||
                (app.issueDescription && app.issueDescription.toLowerCase().includes(q)) ||
                (app.councilId && app.councilId.toLowerCase().includes(q))
            );
        }

        list.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
        });

        return list;
    }, [appointments, statusFilter, searchTerm, sortOrder]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading cross-council consultations...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="page-header-wrapper">
                <h1 className="page-heading">Cross-Council Consultation Records</h1>
                <span className="badge-count">{appointments.length} Total Consultations</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                showStatusFilter={true}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                totalCount={appointments.length}
                filteredCount={filteredAppointments.length}
            />

            <table className="history-table" style={{ marginTop: '1.25rem' }}>
                <thead>
                    <tr>
                        <th>Date Requested</th>
                        <th>Council</th>
                        <th>Patient</th>
                        <th>Assigned Doctor</th>
                        <th>Symptoms & Concerns</th>
                        <th>Status</th>
                        <th>Scheduled Time</th>
                        <th style={{ textAlign: 'center' }}>Slip</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAppointments.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                <p style={{ fontSize: '1.05rem' }}>🔍 No consultation records match the filter criteria.</p>
                            </td>
                        </tr>
                    ) : (
                        filteredAppointments.map((app) => (
                            <tr key={app.appointmentId}>
                                <td style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <span style={{ background: '#f8fafc', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.82rem', fontWeight: 600 }}>
                                        {app.councilId || '5-Roads'}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 700, color: '#0f172a' }}>
                                    👤 {app.patientName}
                                </td>
                                <td style={{ fontWeight: 600, color: '#064e3b' }}>
                                    {app.doctorName ? `🩺 Dr. ${app.doctorName}` : (
                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                                            Pending Claim
                                        </span>
                                    )}
                                </td>
                                <td style={{ maxWidth: '240px' }}>
                                    <div style={{ fontWeight: 600 }}>{app.symptoms}</div>
                                    {app.issueDescription && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {app.issueDescription}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                        {app.status === 'CONFIRMED' ? '✓ ' : '⏳ '}
                                        {app.status}
                                    </span>
                                </td>
                                <td>
                                    {app.appointmentDateTime ? (
                                        <span className="scheduled-badge">
                                            📅 {new Date(app.appointmentDateTime).toLocaleString()}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        className="btn-download-slip"
                                        onClick={() => setSelectedSlipApp(app)}
                                        title="View Consultation Slip"
                                    >
                                        <span>📄</span> Slip
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Slip modal */}
            {selectedSlipApp && (
                <ConsultationSlipModal
                    appointment={selectedSlipApp}
                    onClose={() => setSelectedSlipApp(null)}
                />
            )}
        </div>
    );
};

export default AdminAppointments;

