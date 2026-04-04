import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./NotificationPage.css";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams(filters).toString();
            const res = await api.get(`/notifications/user/getAllNotifications?${query}`);
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [filters]);

    const handleMarkAsRead = async (id) => {
        try {
            await api.patch(`/notifications/user/markAsRead/${id}`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            window.dispatchEvent(new Event("notificationsUpdated"));
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.patch("/notifications/user/markAllAsRead");
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            window.dispatchEvent(new Event("notificationsUpdated"));
        } catch (err) {
            console.error("Error marking all as read:", err);
        }
    };

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h1>Your Notifications</h1>
                <div className="header-actions">
                    <button onClick={handleMarkAllAsRead} className="btn-secondary">Mark all as read</button>
                </div>
            </div>

            <div className="filters-section">
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    placeholder="End Date"
                />
            </div>

            {loading ? (
                <div className="loading">Loading notifications...</div>
            ) : (
                <div className="notifications-list">
                    {notifications.length === 0 ? (
                        <p className="no-notifications">No notifications found.</p>
                    ) : (
                        notifications.map(n => (
                            <div key={n._id} className={`notification-card ${n.isRead ? 'read' : 'unread'}`} onClick={() => handleMarkAsRead(n._id)}>
                                <div className="notification-type">{n.notificationType.replace('_', ' ')}</div>
                                <h3>{n.title || 'Notification'}</h3>
                                <p>{n.message}</p>
                                <span className="notification-date">{new Date(n.createdAt).toLocaleDateString()}</span>
                                {!n.isRead && <span className="unread-dot"></span>}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
