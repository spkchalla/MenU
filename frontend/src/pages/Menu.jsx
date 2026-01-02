import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Menu.css"; // Import the new CSS
import { formatDateToDDMMYYYY } from "../utils/dateUtils";

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

  const otherMealsList = getOtherMealsArray();
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // -----------------------------
  // JSX
  // -----------------------------

  const resetToToday = async () => {
    setSelectedDay(null);
    setSelectedDate("");
    setIsLoading(true);
    await Promise.all([fetchCurrentMeal(), fetchOtherMeals()]);
    setIsLoading(false);
  };

  if (isLoading) return <h2 className="loading-text">Loading...</h2>;
  if (error) return <h2 className="error-text">{error}</h2>;

  return (
    <div className="menu-container">
      {/* Back to Today Button */}
      {(selectedDay || selectedDate) && (
        <button onClick={resetToToday} className="back-btn">
          &larr; Back to Today's Menu
        </button>
      )}

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
          <h2>{currentMeal ? "Other Meals" : `Menu for ${selectedDate ? formatDateToDDMMYYYY(selectedDate) : selectedDay || "the Day"}`}</h2>
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
