import React from 'react';

const StatCards = ({ items = [] }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="stats-grid">
            {items.map((item, idx) => (
                <div key={idx} className={`stat-card stat-${item.variant || 'green'}`}>
                    <div className="stat-card-icon-wrapper">
                        <span className="stat-card-icon">{item.icon}</span>
                    </div>
                    <div className="stat-card-content">
                        <p className="stat-card-label">{item.label}</p>
                        <h3 className="stat-card-val">{item.value}</h3>
                        {item.subtext && <span className="stat-card-subtext">{item.subtext}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;

