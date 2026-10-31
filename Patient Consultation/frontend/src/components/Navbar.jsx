import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationsPopover from './NotificationsPopover';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">
                    <div className="brand-icon-badge">
                        <span>✚</span>
                    </div>
                    <span className="brand-title">Patient <span>e-Portal</span></span>
                </Link>
            </div>
            <div className="navbar-links">
                {!token ? (
                    <>
                        <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
                        <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link>
                    </>
                ) : (
                    <div className="navbar-auth-actions">
                        <NotificationsPopover />
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
