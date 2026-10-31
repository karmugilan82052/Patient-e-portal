import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PaymentQRCode from '../components/PaymentQRCode';

const CreateAppointment = () => {
    const [formData, setFormData] = useState({
        issueDescription: '',
        symptoms: '',
        medications: '',
        preferredDate: ''
    });
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const timeoutRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!paymentConfirmed) {
            setError('Please complete the payment and check the confirmation box before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/appointments', formData);
            setMessage('✓ Consultation request sent successfully! A doctor will contact you with the scheduled time.');
            timeoutRef.current = setTimeout(() => navigate('/patient-history'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card consultation-card">
            <h1>Request Consultation</h1>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Description of the Issue</label>
                    <textarea
                        name="issueDescription"
                        rows="3"
                        required
                        value={formData.issueDescription}
                        onChange={handleChange}
                        placeholder="Provide more context about your concern"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Symptoms</label>
                    <textarea
                        name="symptoms"
                        rows="3"
                        required
                        value={formData.symptoms}
                        onChange={handleChange}
                        placeholder="Describe your symptoms in detail"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Current Medications</label>
                    <textarea
                        name="medications"
                        rows="2"
                        value={formData.medications}
                        onChange={handleChange}
                        placeholder="List any medications you are currently taking"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                        type="date"
                        name="preferredDate"
                        required
                        value={formData.preferredDate}
                        onChange={handleChange}
                    />
                </div>

                {/* Payment Section matching Figure B.3 */}
                <div className="payment-section">
                    <h2>Payment</h2>
                    <div className="payment-fee-badge">
                        Appointment Fee: 200 Rupees
                    </div>

                    <PaymentQRCode />

                    <div className="payment-checkbox-wrapper">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={paymentConfirmed}
                                onChange={(e) => setPaymentConfirmed(e.target.checked)}
                            />
                            <span>Check the box once payment is made</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="primary submit-request-btn"
                    disabled={submitting}
                >
                    <span>🩺</span>
                    {submitting ? 'Submitting Request...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default CreateAppointment;
