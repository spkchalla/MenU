import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css"; // Import the new CSS

// axios instance with env-based base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Log the base URL for debugging
console.log('API Base URL:', api.defaults.baseURL);

export const Menu = () => {
  const [currentMeal, setCurrentMeal] = useState(null);
  const [otherMeals, setOtherMeals] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // Track selected day name
  const [selectedDate, setSelectedDate] = useState(""); // Track selected calendar date
  const [selectedDayDate, setSelectedDayDate] = useState(null); // Track date for selected day button

  // -----------------------------
  // API FUNCTIONS
  // -----------------------------

  const fetchCurrentMeal = async () => {
    try {
      const res = await api.get("/menu/currentMeal");
      setCurrentMeal(res.data.meal);
      setError(null);
    } catch (err) {
      console.error("Error fetching current meal:", err);
      setError("Failed to fetch current meal");
    }
  };

  const fetchOtherMeals = async () => {
    try {
      const res = await api.get("/menu/otherMeals");
      setOtherMeals(res.data.otherMeal);
      setError(null);
    } catch (err) {
      console.error("Error fetching other meals:", err);
      setError("Failed to fetch other meals");
    }
  };

  const fetchMenuByDay = async (day) => {
    try {
      setIsLoading(true);
      setSelectedDay(day);
      setSelectedDate(""); // Clear date selection if day button is clicked

      // Calculate the date for the selected day
      const dayDate = getDateForDayInCurrentWeek(day);
      setSelectedDayDate(dayDate);

      const res = await api.get(`/menu/dayOfPresentWeek/${day}`);
      setCurrentMeal(null);
      setOtherMeals(res.data.mealOfThisDay);
      setError(null);
    } catch (err) {
      setError("Failed to fetch day menu");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuByDate = async (date) => {
    try {
      setIsLoading(true);
      setSelectedDate(date);
      setSelectedDay(null); // Clear day button selection if date is picked
      setSelectedDayDate(null); // Clear day date

      const res = await api.get(`/menu/specificDay/${date}`);
      setCurrentMeal(null);
      setOtherMeals(res.data.menu); // Backend returns { menu: ... }
      setError(null);
    } catch (err) {
      console.error("Error fetching menu by date:", err);
      setError("Failed to fetch menu for this date");
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // PAGE LOAD
  // -----------------------------

  useEffect(() => {
    const loadInitialMenu = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchCurrentMeal(), fetchOtherMeals()]);
      } catch (err) {
        console.error("Error loading initial menu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialMenu();
  }, []);

  // -----------------------------
  // HELPERS
  // -----------------------------

  const getOtherMealsArray = () => {
    if (!otherMeals) return [];
    const order = ["breakfast", "lunch", "snacks", "dinner"];
    const arr = [];
    order.forEach(key => {
      if (otherMeals[key]) {
        arr.push({
          type: key.charAt(0).toUpperCase() + key.slice(1),
          items: otherMeals[key].items
        });
      }
    });
    return arr;
  };

  // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Helper function to get day name from date string
  const getDayNameFromDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Helper function to get the date for a specific day in the current week
  const getDateForDayInCurrentWeek = (dayName) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = daysOfWeek.indexOf(dayName);

    const today = new Date();
    const currentDayIndex = today.getDay();

    // Calculate the difference in days
    const dayDifference = targetDayIndex - currentDayIndex;

    // Create a new date object for the target day
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDifference);

    // Format as YYYY-MM-DD
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const otherMealsList = getOtherMealsArray();
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // -----------------------------
  // JSX
  // -----------------------------

  const resetToToday = async () => {
    setSelectedDay(null);
    setSelectedDate("");
    setSelectedDayDate(null);
    setIsLoading(true);
    await Promise.all([fetchCurrentMeal(), fetchOtherMeals()]);
    setIsLoading(false);
  };

  if (isLoading) return <h2 className="loading-text">Loading...</h2>;
  if (error) return <h2 className="error-text">{error}</h2>;

  return (
    <div className="menu-container">
      <div className="menu-top-actions">
        {/* Back to Today Button */}
        {(selectedDay || selectedDate) && (
          <button onClick={resetToToday} className="back-btn">
            &larr; Back to Today's Menu
          </button>
        )}

        <Link to="/stats" className="highlights-btn">
          📈 Trends
        </Link>
      </div>

      {/* Current / Next Meal */}
      {currentMeal && (
        <div className="current-meal-section">
          <h2>Current / Next Meal</h2>
          <div className="meal-card current-meal-card">
            <div className="meal-title">
              {currentMeal.type || "Meal"}
            </div>
            <ul className="meal-items">
              {currentMeal.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Other Meals */}
      {otherMealsList.length > 0 && (
        <div className="other-meals-section">
          <h2>
            {currentMeal
              ? "Other Meals"
              : selectedDate
                ? `Menu for ${getDayNameFromDate(selectedDate)} (${formatDateToDDMMYYYY(selectedDate)})`
                : selectedDay && selectedDayDate
                  ? `Menu for ${selectedDay} (${formatDateToDDMMYYYY(selectedDayDate)})`
                  : selectedDay
                    ? `Menu for ${selectedDay}`
                    : "Menu for the Day"
            }
          </h2>
          <div className="other-meals-grid">
            {otherMealsList.map((meal, index) => (
              <div key={index} className="meal-card">
                <div className="meal-title">{meal.type}</div>
                <ul className="meal-items">
                  {meal.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Days of the week */}
      <div className="days-container">
        <div className="days-row">
          {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => {
            const isToday = todayName === day;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => fetchMenuByDay(day)}
                className={`day-btn ${isSelected ? 'selected-day' : ''} ${isToday && !isSelected ? 'today-outline' : ''}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="days-row">
          {["Friday", "Saturday", "Sunday"].map((day) => {
            const isToday = todayName === day;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => fetchMenuByDay(day)}
                className={`day-btn ${isSelected ? 'selected-day' : ''} ${isToday && !isSelected ? 'today-outline' : ''}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-section">
        <h3>Check Specific Date</h3>
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={(e) => fetchMenuByDate(e.target.value)}
        />
      </div>
    </div>
  );
};
