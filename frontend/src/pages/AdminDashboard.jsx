import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

// axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('menu_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data States
    const [menus, setMenus] = useState([]); // List of weekly menus (if API supports it) or just current
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedMeal, setSelectedMeal] = useState('breakfast');

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ items: [] });
    const [editTarget, setEditTarget] = useState(null); // { date, day, mealType }

    useEffect(() => {
        const checkAdmin = async () => {
            const token = localStorage.getItem('menu_token');
            const role = localStorage.getItem('menu_user_role');

            if (!token || role !== 'admin') {
                navigate('/login'); // Redirect if not admin
                return;
            }
            setIsAdmin(true);
            setLoading(false);

            // Fetch all menus
            try {
                const res = await api.get('/menu/allMenus');
                setMenus(res.data.menus || []);
            } catch (err) {
                console.error("Failed to fetch all menus:", err);
            }
        };
        checkAdmin();
    }, [navigate]);

    // Mock fetch for demonstration - in real app, fetch list of available menu weeks
    // Since we don't have a "get all menus" endpoint visible in the snippets, 
    // we will focus on the "Check Specific Date" style interaction for editing.

    // Helper to get Monday of the week
    const getMonday = (d) => {
        d = new Date(d);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    };

    const handleDateChange = (e) => {
        const dateStr = e.target.value;
        if (!dateStr) return;

        const date = new Date(dateStr);
        const monday = getMonday(date);
        const mondayStr = monday.toISOString().split('T')[0];

        setSelectedDate(mondayStr); // Set the week start date (Monday)
        // Reset to Monday/Breakfast when week changes
        setSelectedDay('Monday');
        setSelectedMeal('breakfast');
    };

    const handleFetchForEdit = async () => {
        if (!selectedDate) return;

        try {
            // Calculate the specific date for the selected Day based on the Week Start Date (selectedDate is Monday)
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const dayIndex = days.indexOf(selectedDay);

            const targetDate = new Date(selectedDate);
            targetDate.setDate(targetDate.getDate() + dayIndex);
            const targetDateStr = targetDate.toISOString().split('T')[0];

            const res = await api.get(`/menu/specificDay/${targetDateStr}`);
            // The response structure is { menu: { date, breakfast, lunch, ... } }
            const dayMenu = res.data.menu;
            const mealData = dayMenu[selectedMeal.toLowerCase()];

            setEditData({ items: mealData.items });
            setEditTarget({ date: targetDateStr, day: selectedDay, mealType: selectedMeal });
            setIsEditing(true);
        } catch (err) {
            console.error("Error fetching for edit:", err);
            alert("Could not fetch menu for this date.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        alert("Save functionality requires backend support for updating specific meals or full week structure.");
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this menu?")) {
            alert("Delete functionality placeholder");
        }
    };

    if (loading) return <div className="loading-text">Verifying Access...</div>;
    if (!isAdmin) return <div className="error-text">Admin Access Required</div>;

    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>

            {/* Controls */}
            <div className="dashboard-controls">
                <div className="control-group">
                    <label>Select Date (Initializes Week)</label>
                    <input
                        type="date"
                        onChange={handleDateChange}
                        className="admin-input"
                    />
                    <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
                        Select any date from the calendar and that week menu is initialized.
                    </small>
                </div>

                {selectedDate && (
                    <div className="week-info" style={{ width: '100%', marginBottom: '10px', color: 'var(--accent-color)' }}>
                        Week of: {selectedDate} (Monday)
                    </div>
                )}

                <div className="control-group">
                    <label>Day</label>
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="admin-input"
                    >
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label>Meal</label>
                    <select
                        value={selectedMeal}
                        onChange={(e) => setSelectedMeal(e.target.value)}
                        className="admin-input"
                    >
                        {["Breakfast", "Lunch", "Snacks", "Dinner"].map(m => (
                            <option key={m} value={m.toLowerCase()}>{m}</option>
                        ))}
                    </select>
                </div>

                <button onClick={handleFetchForEdit} className="action-btn" disabled={!selectedDate}>Edit This Meal</button>
            </div>

            {/* Edit Form */}
            {isEditing && (
                <div className="edit-form-card">
                    <h3>Editing: {editTarget.date} ({editTarget.day}) - {editTarget.mealType}</h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Items (comma separated)</label>
                            <textarea
                                value={editData.items.join(', ')}
                                onChange={(e) => setEditData({ ...editData, items: e.target.value.split(',').map(s => s.trim()) })}
                                className="admin-textarea"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                            <button type="button" onClick={handleDelete} className="delete-btn">Delete Menu</button>
                        </div>
                    </form>
                </div>
            )}

            {/* All Menus Section */}
            <div className="all-menus-section" style={{ marginTop: '40px' }}>
                <h3>All Created Menus</h3>
                {/* Placeholder for fetching all menus */}
                <div className="menus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {menus.length > 0 ? (
                        menus.map((menu, idx) => (
                            <div key={idx} className="meal-card" style={{ padding: '20px' }}>
                                <div className="meal-title" style={{ fontSize: '1rem' }}>Week of {new Date(menu.weekStartDate).toISOString().split('T')[0]}</div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="link-btn" style={{ fontSize: '0.8rem', padding: '4px 8px' }} onClick={() => {
                                        setSelectedDate(new Date(menu.weekStartDate).toISOString().split('T')[0]);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}>Edit</button>
                                    <button className="delete-btn" style={{ fontSize: '0.8rem', padding: '4px 8px', marginLeft: 0 }} onClick={() => handleDelete(menu.weekStartDate)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
                            No menus found. (Note: Backend endpoint /menu/allMenus is required to list menus here).
                        </div>
                    )}
                </div>
            </div>

            {/* Full Menu Form Placeholder */}
            <div className="full-menu-section">
                <h3>Full Menu Management</h3>
                <p>Use the "Create Menu" or "Update Menu" pages for bulk operations.</p>
                <div className="admin-links">
                    <button onClick={() => navigate('/admin/create-menu')} className="link-btn">Go to Create Menu Form</button>
                    <button onClick={() => navigate('/admin/update-menu')} className="link-btn">Go to Update Menu Form</button>
                </div>
            </div>
        </div>
    );
};
