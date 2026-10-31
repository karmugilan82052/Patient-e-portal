import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const councilId = localStorage.getItem('councilId');

    const getMenuItems = () => {
        if (role === 'USER') {
            return [
                { path: '/create-appointment', label: 'New Request', icon: '✏️' },
                { path: '/patient-history', label: 'My History', icon: '🕒' },
                { path: '/profile', label: 'Profile', icon: '👤' }
            ];
        } else if (role === 'DOCTOR') {
            return [
                { path: '/doctor-dashboard', label: 'Open Enquiries', icon: '🩺' },
                { path: '/doctor-appointments', label: 'My Appointments', icon: '📅' },
                { path: '/profile', label: 'Profile', icon: '👤' }
            ];
        } else if (role === 'ADMIN') {
            return [
                { path: '/admin-dashboard', label: 'System Overview', icon: '📊' },
                { path: '/admin-users', label: 'Manage Users', icon: '👥' },
                { path: '/admin-appointments', label: 'All Consultations', icon: '📋' },
                { path: '/profile', label: 'Admin Profile', icon: '👤' }
            ];
        }
        return [];
    };

    const menuItems = getMenuItems();
    if (menuItems.length === 0) return null;

    const displayName = name || (role === 'ADMIN' ? 'Admin' : (role === 'DOCTOR' ? 'kamal' : 'maria'));
    const initial = (displayName.charAt(0) || 'U').toUpperCase();

    const roleLabel = role === 'ADMIN' ? 'Administrator' : (role === 'DOCTOR' ? 'Doctor' : 'Patient');
    const roleIcon = role === 'ADMIN' ? '👑' : (role === 'DOCTOR' ? '🩺' : initial);

    return (
        <aside className="sidebar">
            <div className="sidebar-user-info">
                <div className="sidebar-avatar">
                    <span>{roleIcon}</span>
                </div>
                <p className="user-name">{displayName}</p>
                <span className={`sidebar-role-badge role-badge-${role ? role.toLowerCase() : 'user'}`}>
                    {roleLabel}
                </span>
                <p className="user-council">
                    Council: <span>{councilId || 'HQ-Admin'}</span>
                </p>
            </div>
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                            <Link to={item.path}>
                                <span className="icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
