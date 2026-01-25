import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Menu.css";

// axios instance with env-based base URL
import api from "../utils/api";



// Simple Eye SVG Icon
const EyeIcon = ({ outlined = true }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Menu = () => {
  const navigate = useNavigate();
  const [currentMeal, setCurrentMeal] = useState(null);
  const [otherMeals, setOtherMeals] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  // New States for Voting & Expansion
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstInOrder, setFirstInOrder] = useState(0); // Which card index to move to top when expanding
  const [userVotes, setUserVotes] = useState({}); // { "foodName": "like"/"dislike" }

  const isToday = !selectedDay && !selectedDate;

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

  const fetchUserVotes = async () => {
    try {
      const res = await api.get("/vote/myTodayVotes");
      const votesMap = {};
      res.data.votes.forEach(v => {
        // Note: backend might return foodId, but we need to match it to foodName in UI
        // Actually, since we don't have foodId easily in UI list, we'll just store and match 
        // Or if we want to be exact, we should fetch foodId mapping.
        // For now, let's store them as foodId and we'll normalize UI names to check.
        votesMap[v.foodId] = v.voteType;
      });
      setUserVotes(votesMap);
    } catch (err) {
      console.error("Error fetching user votes:", err);
    }
  };

  const handleVote = async (foodName, voteType) => {
    try {
      const res = await api.post("/vote/castVote", { foodName, voteType });
      if (res.data.success) {
        // Update local state
        const votedVote = res.data.data;
        setUserVotes(prev => ({
          ...prev,
          [votedVote.foodId]: votedVote.voteType
        }));
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Please login to vote!");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error casting vote");
      }
    }
  };

  const fetchMenuByDay = async (day) => {
    try {
      setIsLoading(true);
      setSelectedDay(day);
      setSelectedDate("");
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
      setSelectedDay(null);
      setSelectedDayDate(null);

      const res = await api.get(`/menu/specificDay/${date}`);
      setCurrentMeal(null);
      setOtherMeals(res.data.menu);
      setError(null);
    } catch (err) {
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
        await Promise.all([fetchCurrentMeal(), fetchOtherMeals(), fetchUserVotes()]);
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

  const toFoodIdLocal = (name) => {
    return name.toLowerCase().trim()
      .replace(/[,&/()]/g, " ")
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

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

    if (isExpanded && firstInOrder !== null) {
      const result = [...arr];
      const selected = result.splice(firstInOrder, 1)[0];
      result.unshift(selected);
      return result;
    }

    return arr;
  };

  const formatDateToDDMMYYYY = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDayNameFromDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDateForDayInCurrentWeek = (dayName) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    const today = new Date();
    const currentDayIndex = today.getDay();
    const dayDifference = targetDayIndex - currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDifference);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleExpand = (index) => {
    if (isExpanded && firstInOrder === index) {
      setIsExpanded(false);
    } else {
      setFirstInOrder(index);
      setIsExpanded(true);
    }
  };

  const otherMealsList = getOtherMealsArray();
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // -----------------------------
  // SHARE FUNCTIONALITY
  // -----------------------------

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this menu!',
      text: 'See what is on the menu today at Mahindra University',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers/devices that don't support navigator.share
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard! Share it with your friends.");
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Ignore user abortion, alert on other errors
        console.error("Error sharing:", err);
        alert("Unable to share at the moment. Link copied to clipboard instead.");
        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch (clipboardErr) {
          // If even clipboard fails, just do nothing or log
          console.error("Clipboard failed too", clipboardErr);
        }
      }
    }
  };

  // -----------------------------
  // JSX COMPONENTS
  // -----------------------------

  const MealItem = ({ item, showVotes }) => {
    const foodId = toFoodIdLocal(item);
    const currentVote = userVotes[foodId];

    return (
      <li key={item}>
        <div className="item-content">{item}</div>
        {showVotes && (
          <div className="vote-actions">
            <button
              className={`vote-btn like ${currentVote === 'like' ? 'active' : ''}`}
              onClick={() => handleVote(item, 'like')}
              title="Like"
            >
              👍
            </button>
            <button
              className={`vote-btn dislike ${currentVote === 'dislike' ? 'active' : ''}`}
              onClick={() => handleVote(item, 'dislike')}
              title="Dislike"
            >
              👎
            </button>
          </div>
        )}
      </li>
    );
  };

  const resetToToday = async () => {
    setSelectedDay(null);
    setSelectedDate("");
    setSelectedDayDate(null);
    setIsLoading(true);
    await Promise.all([fetchCurrentMeal(), fetchOtherMeals(), fetchUserVotes()]);
    setIsLoading(false);
  };

  if (isLoading) return <h2 className="loading-text">Loading...</h2>;
  if (error) return <h2 className="error-text">{error}</h2>;

  return (
    <div className="menu-container">
      <div className="menu-top-actions">
        {selectedDay || selectedDate ? (
          <button onClick={resetToToday} className="back-btn full-width-back-btn">
            &larr; Back to Today's Menu
          </button>
        ) : (
          <>
            <Link to="/stats" className="highlights-btn">
              Trends
            </Link>

            <button onClick={handleShare} className="share-btn">
              Share 📤
            </button>

            <Link to="/install" className="install-btn">
              📲 Install App
            </Link>
          </>
        )}
      </div>

      {currentMeal && (
        <div className="current-meal-section">
          <h2>Current / Next Meal</h2>
          <div className="meal-card current-meal-card">
            <div className="meal-title">{currentMeal.type || "Meal"}</div>
            <ul className="meal-items">
              {currentMeal.items.map((item, index) => (
                <MealItem key={index} item={item} showVotes={isToday} />
              ))}
            </ul>
          </div>
        </div>
      )}

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
          <div className={`other-meals-grid ${isExpanded ? 'expanded' : ''}`}>
            {otherMealsList.map((meal, index) => {
              // Hide eye icon for the 3rd card if it's visually already expanded (spanning 2 columns)
              const isSpanningCard = !isExpanded && otherMealsList.length === 3 && index === 2;

              return (
                <div key={index} className="meal-card">
                  <div className="card-header">
                    <div className="meal-title">{meal.type}</div>
                    {!isSpanningCard && (
                      <button
                        className="expand-toggle"
                        onClick={() => toggleExpand(index)}
                        title={isExpanded ? "Collapse" : "Expand"}
                      >
                        <EyeIcon />
                      </button>
                    )}
                  </div>
                  <ul className="meal-items">
                    {meal.items.map((item, i) => (
                      <MealItem
                        key={i}
                        item={item}
                        showVotes={isToday && (isExpanded || isSpanningCard)}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="days-container">
        <div className="days-row">
          {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => {
            const isTodayBtn = todayName === day;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => fetchMenuByDay(day)}
                className={`day-btn ${isSelected ? 'selected-day' : ''} ${isTodayBtn && !isSelected ? 'today-outline' : ''}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="days-row">
          {["Friday", "Saturday", "Sunday"].map((day) => {
            const isTodayBtn = todayName === day;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => fetchMenuByDay(day)}
                className={`day-btn ${isSelected ? 'selected-day' : ''} ${isTodayBtn && !isSelected ? 'today-outline' : ''}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

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

