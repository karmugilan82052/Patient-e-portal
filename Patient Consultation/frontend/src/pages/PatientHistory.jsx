import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import StatCards from '../components/StatCards';
import SearchFilterBar from '../components/SearchFilterBar';
import ConsultationSlipModal from '../components/ConsultationSlipModal';

const PatientHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlipApp, setSelectedSlipApp] = useState(null);

    // Search, Filter, Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOrder, setSortOrder] = useState('NEWEST');

    const patientName = localStorage.getItem('name') || 'Patient';
    const councilId = localStorage.getItem('councilId') || '5-Roads';

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/appointments/patient');
                setHistory(res.data || []);
            } catch (err) {
                console.error('Failed to fetch history', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Calculate Patient Stat Cards
    const totalRequests = history.length;
    const confirmedCount = useMemo(
        () => history.filter(h => h.status === 'CONFIRMED').length,
        [history]
    );
    const pendingCount = useMemo(
        () => history.filter(h => h.status === 'PENDING').length,
        [history]
    );
    const totalFeesPaid = totalRequests * 200;

    const statItems = [
        {
            label: 'Total Requests',
            value: totalRequests,
            icon: '📋',
            variant: 'blue',
            subtext: 'Consultations raised'
        },
        {
            label: 'Upcoming Consultations',
            value: confirmedCount,
            icon: '📅',
            variant: 'green',
            subtext: 'Confirmed & scheduled'
        },
        {
            label: 'Pending Doctor Review',
            value: pendingCount,
            icon: '⏳',
            variant: 'orange',
            subtext: 'Awaiting doctor'
        },
        {
            label: 'Total Fees Paid',
            value: `₹${totalFeesPaid}`,
            icon: '💳',
            variant: 'green',
            subtext: '₹200 per request'
        }
    ];

    // Filtered & Sorted History
    const filteredHistory = useMemo(() => {
        let list = [...history];

        if (statusFilter !== 'ALL') {
            list = list.filter(app => app.status === statusFilter);
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(app =>
                (app.symptoms && app.symptoms.toLowerCase().includes(q)) ||
                (app.issueDescription && app.issueDescription.toLowerCase().includes(q)) ||
                (app.doctorName && app.doctorName.toLowerCase().includes(q)) ||
                (app.medications && app.medications.toLowerCase().includes(q))
            );
        }

        list.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
        });

        return list;
    }, [history, statusFilter, searchTerm, sortOrder]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--primary-hover)', fontWeight: 600 }}>
                Loading consultation history...
            </div>
        );
    }

    return (
        <div className="history-table-container">
            <div className="page-header-wrapper">
                <h1 className="page-heading">My Consultation Portal</h1>
                <span className="badge-count">{history.length} Requests</span>
            </div>

            {/* Quick Stat Cards */}
            <StatCards items={statItems} />

            {/* Search, Filter & Sort Toolbar */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#064e3b' }}>
                        📜 Consultation History & Invoices
                    </h2>
                </div>

                <SearchFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    showStatusFilter={true}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    totalCount={history.length}
                    filteredCount={filteredHistory.length}
                />
            </div>

            <table className="history-table" style={{ marginTop: '1.25rem' }}>
                <thead>
                    <tr>
                        <th>Date Requested</th>
                        <th>Symptoms & Concerns</th>
                        <th>Doctor / Consultant</th>
                        <th>Status</th>
                        <th>Scheduled Time</th>
                        <th style={{ textAlign: 'center' }}>Slip & Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredHistory.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                <p style={{ fontSize: '1.05rem' }}>
                                    {searchTerm || statusFilter !== 'ALL'
                                        ? '🔍 No consultation records match the selected filter.'
                                        : '🌱 No consultation history found yet.'}
                                </p>
                            </td>
                        </tr>
                    ) : (
                        filteredHistory.map((app) => (
                            <tr key={app.appointmentId}>
                                <td style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ maxWidth: '280px' }}>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{app.symptoms}</div>
                                    {app.issueDescription && (
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {app.issueDescription}
                                        </div>
                                    )}
                                </td>
                                <td style={{ fontWeight: 600, color: '#064e3b' }}>
                                    {app.doctorName ? `Dr. ${app.doctorName}` : (
                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                                            To be assigned
                                        </span>
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
                                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.88rem' }}>
                                            Pending Schedule
                                        </span>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        className="btn-download-slip"
                                        onClick={() => setSelectedSlipApp({ ...app, patientName, councilId })}
                                        title="Download or Print Consultation Slip & Receipt"
                                    >
                                        <span>📄</span> Download Slip
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Consultation Slip & Invoice Modal */}
            {selectedSlipApp && (
                <ConsultationSlipModal
                    appointment={selectedSlipApp}
                    onClose={() => setSelectedSlipApp(null)}
                />
            )}
        </div>
    );
};

export default PatientHistory;
