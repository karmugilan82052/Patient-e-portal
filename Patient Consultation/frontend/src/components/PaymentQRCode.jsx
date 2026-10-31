import React from 'react';

const PaymentQRCode = () => {
    // Generate a consistent pseudo-QR pattern with standard finder patterns
    // Size 25x25 grid
    const size = 25;
    const isFinder = (r, c) => {
        // Top-left
        if (r <= 6 && c <= 6) return true;
        // Top-right
        if (r <= 6 && c >= size - 7) return true;
        // Bottom-left
        if (r >= size - 7 && c <= 6) return true;
        return false;
    };

    const isCenter = (r, c) => {
        return r >= 10 && r <= 14 && c >= 10 && c <= 14;
    };

    // Pre-calculated deterministic hash for authentic-looking QR data
    const modules = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (isFinder(r, c) || isCenter(r, c)) continue;
            // Deterministic pseudorandom bit generator
            const v = (r * 17 + c * 31 + (r ^ c) * 13) % 7;
            if (v === 0 || v === 2 || v === 5) {
                modules.push({ r, c });
            }
        }
    }

    return (
        <div className="payment-qr-wrapper">
            <div className="payment-qr-card">
                <svg
                    width="140"
                    height="140"
                    viewBox="0 0 250 250"
                    style={{ background: '#ffffff', padding: '6px', borderRadius: '8px' }}
                >
                    {/* Background */}
                    <rect width="250" height="250" fill="#ffffff" />

                    {/* Finder pattern Top-Left */}
                    <rect x="10" y="10" width="70" height="70" fill="#000000" rx="4" />
                    <rect x="20" y="20" width="50" height="50" fill="#ffffff" rx="2" />
                    <rect x="30" y="30" width="30" height="30" fill="#000000" rx="2" />

                    {/* Finder pattern Top-Right */}
                    <rect x="170" y="10" width="70" height="70" fill="#000000" rx="4" />
                    <rect x="180" y="20" width="50" height="50" fill="#ffffff" rx="2" />
                    <rect x="190" y="30" width="30" height="30" fill="#000000" rx="2" />

                    {/* Finder pattern Bottom-Left */}
                    <rect x="10" y="170" width="70" height="70" fill="#000000" rx="4" />
                    <rect x="20" y="180" width="50" height="50" fill="#ffffff" rx="2" />
                    <rect x="30" y="190" width="30" height="30" fill="#000000" rx="2" />

                    {/* Timing patterns */}
                    {[9, 11, 13, 15].map(i => (
                        <React.Fragment key={`timing-${i}`}>
                            <rect x={i * 10} y="40" width="10" height="10" fill="#000000" />
                            <rect x="40" y={i * 10} width="10" height="10" fill="#000000" />
                        </React.Fragment>
                    ))}

                    {/* Data modules */}
                    {modules.map((m, idx) => (
                        <rect
                            key={idx}
                            x={m.c * 10}
                            y={m.r * 10}
                            width="9"
                            height="9"
                            fill="#000000"
                            rx="1"
                        />
                    ))}

                    {/* Center Badge with Google Pay / GPay colors */}
                    <circle cx="125" cy="125" r="24" fill="#ffffff" stroke="#a7f3d0" strokeWidth="2" />
                    {/* Google "G" logo in center */}
                    <g transform="translate(110, 110) scale(0.65)">
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"
                        />
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.55 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                    </g>
                </svg>
            </div>
            <div className="upi-id-text">
                UPI ID: <span>karmugilan08@okaxis</span>
            </div>
            <div className="payment-verified-tag">
                <span>🛡️</span> Verified Healthcare Merchant
            </div>
        </div>
    );
};

export default PaymentQRCode;
