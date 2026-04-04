import React, { useState, useEffect } from "react";
import api from "../utils/api";
import "./AdminNotificationCRUD.css";

const AdminNotificationCRUD = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        notificationType: "update",
        title: "",
        message: "",
        isBanner: false,
        link: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const [status, setStatus] = useState({ type: "", message: "" });

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams(filters).toString();
            const res = await api.get(`/notifications/admin/getAllNotifications?${query}`);
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error("Error fetching admin notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [filters]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.patch(`/notifications/updateNotification/${editingId}`, formData);
            } else {
                await api.post("/notifications/createNotification", formData);
            }
            setFormData({ notificationType: "update", title: "", message: "", isBanner: false, link: "" });
            setEditingId(null);
            setStatus({ type: "success", message: editingId ? "Notification updated!" : "Notification created!" });

            // Clear filters to ensure the new/updated one shows up
            setFilters({ startDate: "", endDate: "" });

            // Re-fetch (though useEffect will trigger if filters changed, let's be sure)
            fetchNotifications();

            setTimeout(() => setStatus({ type: "", message: "" }), 3000);
        } catch (err) {
            console.error("Error saving notification:", err);
            setStatus({ type: "error", message: "Failed to save notification" });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notification?")) return;
        try {
            await api.delete(`/notifications/deleteNotification/${id}`);
            fetchNotifications();
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const handleEdit = (n) => {
        setFormData({
            notificationType: n.notificationType,
            title: n.title || "",
            message: n.message,
            isBanner: n.isBanner,
            link: n.link || ""
        });
        setEditingId(n._id);
    };

    return (
        <div className="admin-notifications-container">
            <h1>Manage Notifications</h1>

            {status.message && <div className={`status-msg ${status.type}`}>{status.message}</div>}

            <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-row">
                    <select
                        value={formData.notificationType}
                        onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
                    >
                        <option value="update">Update</option>
                        <option value="new_feature">New Feature</option>
                        <option value="important">Important</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Title (optional)"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                />
                <div className="form-row">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.isBanner}
                            onChange={(e) => setFormData({ ...formData, isBanner: e.target.checked })}
                        /> Is Banner?
                    </label>
                    <input
                        type="text"
                        placeholder="Redirect Link (optional)"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn-primary">
                    {editingId ? "Update Notification" : "Create Notification"}
                </button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ notificationType: "update", title: "", message: "", isBanner: false, link: "" }) }} className="btn-secondary">Cancel</button>}
            </form>

            <div className="filters-section">
                <h3>Filter by Date</h3>
                <div className="filter-inputs">
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    />
                    {(filters.startDate || filters.endDate) && (
                        <button onClick={() => setFilters({ startDate: "", endDate: "" })} className="clear-btn">Clear Filters</button>
                    )}
                </div>
            </div>

            <div className="notification-list-wrapper">
                {loading ? (
                    <p style={{ padding: "1rem" }}>Loading notifications...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Banner?</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: "center" }}>No notifications found for selected filters.</td></tr>
                            ) : (
                                notifications.map(n => (
                                    <tr key={n._id}>
                                        <td><span className={`type-badge ${n.notificationType}`}>{n.notificationType.replace('_', ' ')}</span></td>
                                        <td>{n.title || '-'}</td>
                                        <td>{n.isBanner ? '✅' : '❌'}</td>
                                        <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button onClick={() => handleEdit(n)} className="btn-edit" title="Edit">✎</button>
                                                <button onClick={() => handleDelete(n._id)} className="btn-delete" title="Delete">🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminNotificationCRUD;
