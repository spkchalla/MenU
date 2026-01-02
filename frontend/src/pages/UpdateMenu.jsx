import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Auth.css';

// axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
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

  // Auto-fetch menu when date changes
  useEffect(() => {
    if (weekStartDate) {
      handleFetchMenu(true);
    }
  }, [weekStartDate]);

  const handleInputChange = (day, meal, value) => {
    setFormData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }));
  };

  const handleFetchMenu = async (isAuto = false) => {
    if (!weekStartDate) {
      if (!isAuto) alert("Please select a date first.");
      return;
    }
    setLoading(true);
    try {
      // Calculate selected day name to set it as active if it's the first time
      const selectedDate = new Date(weekStartDate);
      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      setActiveDay(dayName);

      const res = await api.get(`/menu/weeklyMenu/${weekStartDate}`);
      if (res.data && res.data.weeklyMenu) {
        const weeklyMenu = res.data.weeklyMenu;

        // Sync weekStartDate with the actual Monday from backend WITHOUT triggering a new fetch
        // (useEffect will see the same string and won't re-run if it's identical)
        if (weeklyMenu.weekStartDate) {
          const syncedDate = weeklyMenu.weekStartDate.split('T')[0];
          setWeekStartDate(syncedDate);
        }

        // Create a fresh state object to avoid mutations
        const newFormData = {};
        days.forEach(d => {
          newFormData[d] = { breakfast: '', lunch: '', snacks: '', dinner: '' };
        });

        weeklyMenu.days.forEach(dayData => {
          const dName = dayData.day;
          if (newFormData[dName]) {
            meals.forEach(meal => {
              if (dayData[meal] && dayData[meal].items) {
                newFormData[dName][meal] = dayData[meal].items.join(', ');
              }
            });
          }
        });

        setFormData(newFormData);
        if (!isAuto) alert("Menu data loaded for the week!");
      } else {
        // If no menu found, reset the form for that week
        const resetData = {};
        days.forEach(d => {
          resetData[d] = { breakfast: '', lunch: '', snacks: '', dinner: '' };
        });
        setFormData(resetData);
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      if (!isAuto) alert("Failed to load menu data. " + (err.response?.data?.message || err.message));

      // Optionally reset form on error (e.g. 404 menu not found)
      const resetData = {};
      days.forEach(d => {
        resetData[d] = { breakfast: '', lunch: '', snacks: '', dinner: '' };
      });
      setFormData(resetData);
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
            <label htmlFor="weekStartDate">Select Date</label>
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
