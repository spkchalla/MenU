import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

// axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('menu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const UpdateMenu = () => {
  const [weekStartDate, setWeekStartDate] = useState('');
  const [activeDay, setActiveDay] = useState('Monday');
  const [formData, setFormData] = useState({
    Monday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
    Tuesday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
    Wednesday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
    Thursday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
    Friday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
    Saturday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
    Sunday: { breakfast: '', lunch: '', snacks: '', dinner: '' },
  });
  const [loading, setLoading] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["breakfast", "lunch", "snacks", "dinner"];

  const handleInputChange = (day, meal, value) => {
    setFormData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }));
  };

  const handleFetchMenu = async () => {
    if (!weekStartDate) {
      alert("Please select a week start date first.");
      return;
    }
    setLoading(true);
    try {
      // Since we don't have a single "getWeeklyMenu" endpoint, we will fetch each day individually
      // This is a frontend workaround.
      const startDate = new Date(weekStartDate);
      const newFormData = { ...formData };

      const fetchPromises = days.map(async (day, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        const dateStr = currentDate.toISOString().split('T')[0];

        try {
          const res = await api.get(`/menu/specificDay/${dateStr}`);
          if (res.data && res.data.menu) {
            const menu = res.data.menu;
            // Map backend structure to form structure
            // Backend: { breakfast: { items: [] }, ... }
            // Form: { breakfast: "item1, item2", ... }
            meals.forEach(meal => {
              if (menu[meal] && menu[meal].items) {
                newFormData[day][meal] = menu[meal].items.join(', ');
              }
            });
          }
        } catch (e) {
          // Ignore 404s or errors for specific days, just leave them blank
          console.log(`No menu found for ${dateStr} (${day})`);
        }
      });

      await Promise.all(fetchPromises);
      setFormData(newFormData);
      alert("Menu data loaded for the week!");
    } catch (err) {
      console.error("Error fetching menu:", err);
      alert("Failed to load menu data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Construct the payload
      const payload = {
        weekStartDate,
        days: days.map(day => ({
          day,
          breakfast: { items: formData[day].breakfast.split(',').map(i => i.trim()).filter(i => i) },
          lunch: { items: formData[day].lunch.split(',').map(i => i.trim()).filter(i => i) },
          snacks: { items: formData[day].snacks.split(',').map(i => i.trim()).filter(i => i) },
          dinner: { items: formData[day].dinner.split(',').map(i => i.trim()).filter(i => i) }
        }))
      };

      await api.put(`/menu/updateMenu/${weekStartDate}`, payload);
      alert("Menu updated successfully!");
    } catch (err) {
      console.error("Error updating menu:", err);
      alert("Failed to update menu. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container update-menu-container" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '900px', width: '100%' }}>
        <h2>Update Weekly Menu</h2>
        <p className="auth-subtitle">Manually update the menu for a specific week</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="weekStartDate">Week Start Date (Monday)</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="date"
                id="weekStartDate"
                value={weekStartDate}
                onChange={(e) => setWeekStartDate(e.target.value)}
                required
                style={{ flex: 1 }}
              />
              <button type="button" onClick={handleFetchMenu} className="submit-btn" style={{ width: 'auto', padding: '0 20px', marginTop: 0 }}>
                Load
              </button>
            </div>
          </div>

          {/* Day Tabs */}
          <div className="day-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
            {days.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                style={{
                  background: activeDay === day ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--card-border)',
                  color: activeDay === day ? 'white' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Meal Inputs for Active Day */}
          <div className="day-form" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--accent-color)' }}>{activeDay}</h3>
            <div className="meals-grid-responsive">
              {meals.map(meal => (
                <div key={meal} className="form-group">
                  <label style={{ textTransform: 'capitalize' }}>{meal} (comma separated)</label>
                  <textarea
                    value={formData[activeDay][meal]}
                    onChange={(e) => handleInputChange(activeDay, meal, e.target.value)}
                    placeholder={`Items for ${meal}...`}
                    style={{
                      minHeight: '80px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-main)',
                      resize: 'vertical',
                      width: '100%'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: '24px' }}>
            {loading ? 'Updating...' : 'Update Menu'}
          </button>
        </form>

        <style>{`
            .meals-grid-responsive {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            @media (max-width: 600px) {
                .meals-grid-responsive {
                    grid-template-columns: 1fr;
                }
            }
        `}</style>
      </div>
    </div>
  );
};
