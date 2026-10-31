import React from 'react';

const ConsultationSlipModal = ({ appointment, onClose }) => {
    if (!appointment) return null;

    const handlePrint = () => {
        window.print();
    };

    const invoiceId = `INV-${(appointment.appointmentId || '0000').slice(-6).toUpperCase()}`;
    const appointmentDate = appointment.appointmentDateTime
        ? new Date(appointment.appointmentDateTime).toLocaleString()
        : (appointment.preferredDate || 'Pending Schedule');
    const createdDate = appointment.createdAt
        ? new Date(appointment.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString();

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content slip-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Print and Close controls */}
                <div className="slip-controls no-print">
                    <button className="btn-print" onClick={handlePrint}>
                        <span>🖨️</span> Print / Save PDF
                    </button>
                    <button className="btn-close-modal" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Printable Medical Slip */}
                <div className="printable-slip">
                    {/* Header */}
                    <div className="slip-header">
                        <div className="slip-brand">
                            <div className="slip-logo-badge">✚</div>
                            <div>
                                <h2 className="slip-title">Patient e-Portal</h2>
                                <p className="slip-subtitle">Certified Online Teleconsultation Service</p>
                            </div>
                        </div>
                        <div className="slip-meta">
                            <div className="slip-meta-item">
                                <span className="meta-label">Invoice Ref:</span>
                                <span className="meta-val font-mono">{invoiceId}</span>
                            </div>
                            <div className="slip-meta-item">
                                <span className="meta-label">Date Issued:</span>
                                <span className="meta-val">{createdDate}</span>
                            </div>
                            <div className="slip-meta-item">
                                <span className="meta-label">Council:</span>
                                <span className="meta-val">{appointment.councilId || '5-Roads'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="slip-divider"></div>

                    {/* Patient & Doctor Grid */}
                    <div className="slip-grid-2">
                        <div className="slip-block">
                            <h3 className="block-title">👤 Patient Information</h3>
                            <div className="slip-row">
                                <span className="label">Name:</span>
                                <span className="val bold">{appointment.patientName || 'Maria'}</span>
                            </div>
                            <div className="slip-row">
                                <span className="label">Age / Gender:</span>
                                <span className="val">
                                    {appointment.age ? `${appointment.age} yrs` : 'N/A'}, {appointment.gender || 'Not specified'}
                                </span>
                            </div>
                            <div className="slip-row">
                                <span className="label">Blood Group:</span>
                                <span className="val badge-blood">{appointment.bloodGroup || 'Not specified'}</span>
                            </div>
                            <div className="slip-row">
                                <span className="label">Known Allergies:</span>
                                <span className="val">{appointment.allergies || 'None recorded'}</span>
                            </div>
                            {appointment.emergencyContact && (
                                <div className="slip-row">
                                    <span className="label">Emergency Contact:</span>
                                    <span className="val">{appointment.emergencyContact}</span>
                                </div>
                            )}
                        </div>

                        <div className="slip-block">
                            <h3 className="block-title">🩺 Consultation Details</h3>
                            <div className="slip-row">
                                <span className="label">Doctor / Consultant:</span>
                                <span className="val bold">Dr. {appointment.doctorName || 'Kamal (Assigned Doctor)'}</span>
                            </div>
                            <div className="slip-row">
                                <span className="label">Scheduled Time:</span>
                                <span className="val text-green bold">{appointmentDate}</span>
                            </div>
                            <div className="slip-row">
                                <span className="label">Appointment Status:</span>
                                <span className="val status-pill status-confirmed">
                                    {appointment.status || 'CONFIRMED'}
                                </span>
                            </div>
                            <div className="slip-row">
                                <span className="label">Consultation Type:</span>
                                <span className="val">Online Video / Teleconsult</span>
                            </div>
                        </div>
                    </div>

                    {/* Medical Concerns */}
                    <div className="slip-section">
                        <h3 className="block-title">📋 Clinical Summary & Symptoms</h3>
                        <div className="summary-box">
                            <p><strong>Primary Concern:</strong> {appointment.issueDescription || 'General Consultation'}</p>
                            <p style={{ marginTop: '4px' }}><strong>Reported Symptoms:</strong> {appointment.symptoms || 'None reported'}</p>
                            {appointment.medications && (
                                <p style={{ marginTop: '4px' }}><strong>Current Medications:</strong> {appointment.medications}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Receipt Table */}
                    <div className="slip-section">
                        <h3 className="block-title">💳 Payment Receipt</h3>
                        <table className="slip-receipt-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Council Fee</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Online Doctor Consultation Fee</td>
                                    <td>{appointment.councilId || '5-Roads'}</td>
                                    <td><span className="status-pill status-confirmed">PAID (UPI)</span></td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹200.00</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Paid:</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-hover)', fontSize: '1.1rem' }}>
                                        ₹200.00
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Footer Verification with Stamp */}
                    <div className="slip-footer">
                        <div className="slip-footer-text">
                            <p>This is a computer-generated medical consultation slip and official payment receipt.</p>
                            <p>Presented by the Certified Medical Practitioner Council.</p>
                        </div>
                        <div className="slip-stamp">
                            <div className="stamp-circle">
                                <span>✓ VERIFIED</span>
                                <small>PAID & SCHEDULED</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationSlipModal;

