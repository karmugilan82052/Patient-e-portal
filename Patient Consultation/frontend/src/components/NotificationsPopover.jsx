import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const NotificationsPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const popoverRef = useRef(null);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Load read notifications IDs from localStorage
    const getReadIds = () => {
        try {
            return JSON.parse(localStorage.getItem('read_notifications') || '[]');
        } catch (e) {
            return [];
        }
    };

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const readIds = getReadIds();
            const notifs = [];

            if (role === 'DOCTOR') {
                const res = await api.get('/appointments/doctor');
                const apps = res.data || [];
                // Generate notifications for pending enquiries
                apps.forEach(app => {
                    const id = `notif-doc-${app.appointmentId}-${app.status}`;
                    const isRead = readIds.includes(id);
                    if (app.status === 'PENDING') {
                        notifs.push({
                            id,
                            title: 'New Consultation Request',
                            message: `Patient ${app.patientName} requested a consultation for ${app.preferredDate || 'soon'}.`,
                            time: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent',
                            isRead,
                            type: 'pending'
                        });
                    }
                });
            } else if (role === 'USER') {
                const res = await api.get('/appointments/patient');
                const apps = res.data || [];
                apps.forEach(app => {
                    const id = `notif-user-${app.appointmentId}-${app.status}-${app.appointmentDateTime || ''}`;
                    const isRead = readIds.includes(id);
                    if (app.status === 'CONFIRMED') {
                        const schedStr = app.appointmentDateTime
                            ? new Date(app.appointmentDateTime).toLocaleString()
                            : 'Confirmed';
                        notifs.push({
                            id,
                            title: 'Appointment Scheduled!',
                            message: `Your consultation with Dr. ${app.doctorName || 'Consultant'} has been scheduled for ${schedStr}.`,
                            time: app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : 'Recent',
                            isRead,
                            type: 'confirmed'
                        });
                    }
                });
            }

            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.isRead).length);
        } catch (err) {
            // Silently fail if not logged in
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000); // Polling every 15s
        return () => clearInterval(interval);
    }, [token, role]);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => {
        const readIds = getReadIds();
        const allIds = [...new Set([...readIds, ...notifications.map(n => n.id)])];
        localStorage.setItem('read_notifications', JSON.stringify(allIds));
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    if (!token) return null;

    return (
        <div className="notifications-wrapper" ref={popoverRef}>
            <button
                className="btn-notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
                aria-label="View notifications"
            >
                <span className="bell-icon">🔔</span>
                {unreadCount > 0 && (
                    <span className="notification-badge-count">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notifications-dropdown">
                    <div className="notif-header">
                        <div className="notif-header-title">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <span className="notif-unread-pill">{unreadCount} new</span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button className="btn-mark-all-read" onClick={markAllAsRead}>
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notif-body">
                        {notifications.length === 0 ? (
                            <div className="notif-empty">
                                <span>🌿</span>
                                <p>No notifications yet</p>
                                <small>You're all caught up!</small>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notif-item ${notif.isRead ? 'read' : 'unread'}`}
                                >
                                    <div className={`notif-icon-circle ${notif.type}`}>
                                        {notif.type === 'confirmed' ? '✓' : '🩺'}
                                    </div>
                                    <div className="notif-content">
                                        <p className="notif-item-title">{notif.title}</p>
                                        <p className="notif-item-message">{notif.message}</p>
                                        <span className="notif-item-time">{notif.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsPopover;

