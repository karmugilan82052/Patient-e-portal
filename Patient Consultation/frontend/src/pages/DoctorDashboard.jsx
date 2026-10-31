import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import StatCards from '../components/StatCards';
import SearchFilterBar from '../components/SearchFilterBar';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Search and Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('NEWEST');

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/appointments/doctor');
            setAppointments(res.data || []);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Failed to fetch enquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id, status, scheduledTime) => {
        try {
            await api.put(`/appointments/${id}`, {
                status,
                appointmentDateTime: scheduledTime
            });
            fetchAppointments();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    // Calculate Doctor Dashboard Stat Metrics
    const pendingAppointments = useMemo(
        () => appointments.filter(app => app.status === 'PENDING'),
        [appointments]
    );

    const confirmedAppointments = useMemo(
        () => appointments.filter(app => app.status === 'CONFIRMED'),
        [appointments]
    );

    const uniquePatientsCount = useMemo(() => {
        const set = new Set(appointments.map(a => a.userId || a.patientName));
        return set.size;
    }, [appointments]);

    const totalRevenue = confirmedAppointments.length * 200;

    const statItems = [
        {
            label: 'Pending Enquiries',
            value: pendingAppointments.length,
            icon: '⏳',
            variant: 'orange',
            subtext: 'Awaiting scheduling'
        },
        {
            label: 'Confirmed Today',
            value: confirmedAppointments.length,
            icon: '📅',
            variant: 'green',
            subtext: 'Ready for consult'
        },
        {
            label: 'Total Patients',
            value: uniquePatientsCount,
            icon: '👥',
            variant: 'blue',
            subtext: 'In your council'
        },
        {
            label: 'Consultation Revenue',
            value: `₹${totalRevenue}`,
            icon: '💳',
            variant: 'green',
            subtext: '₹200 / consultation'
        }
    ];

    // Filter and Sort Pending Enquiries
    const filteredPending = useMemo(() => {
        let list = [...pendingAppointments];

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(app =>
                (app.patientName && app.patientName.toLowerCase().includes(q)) ||
                (app.symptoms && app.symptoms.toLowerCase().includes(q)) ||
                (app.issueDescription && app.issueDescription.toLowerCase().includes(q)) ||
                (app.bloodGroup && app.bloodGroup.toLowerCase().includes(q)) ||
                (app.allergies && app.allergies.toLowerCase().includes(q))
            );
        }

        list.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.preferredDate || 0);
            const dateB = new Date(b.createdAt || b.preferredDate || 0);
            return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
        });

        return list;
    }, [pendingAppointments, searchTerm, sortOrder]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading doctor dashboard & enquiries...
            </div>
        );
    }

    return (
        <div className="doctor-enquiries-container">
            <div className="page-header-wrapper">
                <h1 className="page-heading">Doctor Dashboard</h1>
                <span className="badge-count">{pendingAppointments.length} Pending Actions</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Quick Stat Cards */}
            <StatCards items={statItems} />

            {/* Search and Sort Toolbar */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#064e3b' }}>
                        📋 Open Enquiries Awaiting Schedule
                    </h2>
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    showStatusFilter={false}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    totalCount={pendingAppointments.length}
                    filteredCount={filteredPending.length}
                />
            </div>

            <div className="enquiries-list" style={{ marginTop: '1.25rem' }}>
                {filteredPending.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.05rem', margin: '1rem 0' }}>
                            {searchTerm ? '🔍 No matching enquiries found for this search.' : '🌱 No open enquiries at the moment.'}
                        </p>
                    </div>
                ) : (
                    filteredPending.map((app) => (
                        <OpenEnquiryCard
                            key={app.appointmentId}
                            app={app}
                            onUpdate={handleUpdateStatus}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const OpenEnquiryCard = ({ app, onUpdate }) => {
    const [scheduledTime, setScheduledTime] = useState('');

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const [y, m, d] = dateStr.split('T')[0].split('-');
            if (y && m && d) return `${parseInt(m, 10)}/${parseInt(d, 10)}/${y}`;
            return new Date(dateStr).toLocaleDateString();
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="enquiry-card">
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
                <div style={{ textAlign: 'right' }}>
                    <p className="preferred-date">
                        Requested Date: <span>{formatDate(app.preferredDate)}</span>
                    </p>
                    <span className="fee-paid-tag">✓ ₹200 Paid (UPI)</span>
                </div>
            </div>

            {/* Extended Patient Health Vitals Review */}
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
                    <span className="vital-label">Known Allergies</span>
                    <span className="vital-value allergy-text">
                        {app.allergies && app.allergies !== 'None' ? `⚠️ ${app.allergies}` : 'None reported'}
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
                {/* Left Column: Symptoms, Issue Description, Medications, Status */}
                <div className="enquiry-info-column">
                    <div className="info-block">
                        <label className="info-label">Primary Issue / Concern:</label>
                        <div className="info-value-box">{app.issueDescription || 'None'}</div>
                    </div>

                    <div className="info-block">
                        <label className="info-label">Reported Symptoms:</label>
                        <div className="info-value-box">{app.symptoms || 'None'}</div>
                    </div>

                    <div className="info-block">
                        <label className="info-label">Current Medications:</label>
                        <div className="info-value-box">{app.medications || 'None'}</div>
                    </div>

                    <div className="status-badge-container">
                        <span className="status-pill status-pending">
                            <span>⏳</span> {app.status}
                        </span>
                    </div>
                </div>

                {/* Right Column: Schedule date-time and Confirm button */}
                <div className="enquiry-action-column">
                    <label className="action-label">Set Consultation Date & Time</label>
                    <div className="schedule-row">
                        <input
                            type="datetime-local"
                            className="schedule-datetime-input"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn-confirm-schedule"
                            onClick={() => {
                                if (!scheduledTime) {
                                    alert('Please set appointment date and time first');
                                    return;
                                }
                                onUpdate(app.appointmentId, 'CONFIRMED', scheduledTime);
                            }}
                        >
                            ✓ Confirm & Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
