import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import SearchFilterBar from '../components/SearchFilterBar';
import ConsultationSlipModal from '../components/ConsultationSlipModal';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSlipApp, setSelectedSlipApp] = useState(null);

    // Search and Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('NEWEST');

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments/doctor');
            setAppointments(res.data || []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const confirmedAppointments = useMemo(
        () => appointments.filter(app => app.status === 'CONFIRMED'),
        [appointments]
    );

    const filteredConfirmed = useMemo(() => {
        let list = [...confirmedAppointments];

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(app =>
                (app.patientName && app.patientName.toLowerCase().includes(q)) ||
                (app.symptoms && app.symptoms.toLowerCase().includes(q)) ||
                (app.issueDescription && app.issueDescription.toLowerCase().includes(q)) ||
                (app.bloodGroup && app.bloodGroup.toLowerCase().includes(q))
            );
        }

        list.sort((a, b) => {
            const dateA = new Date(a.appointmentDateTime || a.createdAt || 0);
            const dateB = new Date(b.appointmentDateTime || b.createdAt || 0);
            return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
        });

        return list;
    }, [confirmedAppointments, searchTerm, sortOrder]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading confirmed appointments...
            </div>
        );
    }

    return (
        <div className="doctor-enquiries-container">
            <div className="page-header-wrapper">
                <h1 className="page-heading">My Confirmed Appointments</h1>
                <span className="badge-count">{confirmedAppointments.length} Scheduled</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Search and Sort Toolbar */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showStatusFilter={false}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                totalCount={confirmedAppointments.length}
                filteredCount={filteredConfirmed.length}
            />

            <div className="enquiries-list" style={{ marginTop: '1.5rem' }}>
                {filteredConfirmed.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.05rem', margin: '1rem 0' }}>
                            {searchTerm ? '🔍 No matching appointments found.' : '📅 No confirmed appointments yet.'}
                        </p>
                    </div>
                ) : (
                    filteredConfirmed.map((app) => (
                        <div
                            key={app.appointmentId}
                            className="enquiry-card"
                            style={{ borderLeftColor: '#10b981' }}
                        >
                            <div className="enquiry-card-header">
                                <div>
                                    <h2 className="patient-name">
                                        <span>👤</span> {app.patientName}
                                    </h2>
                                    {app.patientEmail && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {app.patientEmail}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="scheduled-badge">
                                        📅 {app.appointmentDateTime ? new Date(app.appointmentDateTime).toLocaleString() : 'Confirmed'}
                                    </span>
                                    <button
                                        className="btn-action-slip"
                                        onClick={() => setSelectedSlipApp(app)}
                                        title="View Consultation Slip / Invoice"
                                    >
                                        <span>📄</span> Slip
                                    </button>
                                </div>
                            </div>

                            {/* Patient Vitals Strip */}
                            <div className="patient-vitals-strip">
                                <div className="vital-item">
                                    <span className="vital-label">Blood Group</span>
                                    <span className="vital-value badge-blood">{app.bloodGroup || 'Not provided'}</span>
                                </div>
                                <div className="vital-item">
                                    <span className="vital-label">Age & Gender</span>
                                    <span className="vital-value">
                                        {app.age ? `${app.age} yrs` : 'N/A'}, {app.gender || 'N/A'}
                                    </span>
                                </div>
                                <div className="vital-item">
                                    <span className="vital-label">Allergies</span>
                                    <span className="vital-value allergy-text">
                                        {app.allergies && app.allergies !== 'None' ? `⚠️ ${app.allergies}` : 'None'}
                                    </span>
                                </div>
                                {app.emergencyContact && (
                                    <div className="vital-item">
                                        <span className="vital-label">Emergency Phone</span>
                                        <span className="vital-value">{app.emergencyContact}</span>
                                    </div>
                                )}
                            </div>

                            <div className="enquiry-card-body" style={{ marginTop: '1.25rem' }}>
                                <div className="enquiry-info-column" style={{ width: '100%' }}>
                                    <div className="info-block">
                                        <label className="info-label">Primary Concern:</label>
                                        <div className="info-value-box">{app.issueDescription || 'General Consultation'}</div>
                                    </div>
                                    <div className="info-block">
                                        <label className="info-label">Symptoms:</label>
                                        <div className="info-value-box">{app.symptoms}</div>
                                    </div>
                                    {app.medications && (
                                        <div className="info-block">
                                            <label className="info-label">Current Medications:</label>
                                            <div className="info-value-box">{app.medications}</div>
                                        </div>
                                    )}
                                    <div className="status-badge-container">
                                        <span className="status-pill status-confirmed">
                                            <span>✓</span> CONFIRMED & SCHEDULED
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Consultation Slip Modal */}
            {selectedSlipApp && (
                <ConsultationSlipModal
                    appointment={selectedSlipApp}
                    onClose={() => setSelectedSlipApp(null)}
                />
            )}
        </div>
    );
};

export default DoctorAppointments;
