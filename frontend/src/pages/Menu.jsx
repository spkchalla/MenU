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
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      if (err.response && err.response.status === 404) {
        setCurrentMeal(null);
        return;
      }
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
      if (err.response && err.response.status === 404) {
        setOtherMeals(null);
        return;
      }
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
        votesMap[v.foodId] = v.voteType;
      });
      setUserVotes(votesMap);
    } catch (err) {
      console.error("Error fetching user votes:", err);
    }
  };

  const handleGoogleAuth = () => {
    if (import.meta.env.VITE_VERCEL_ENV === "preview" || window.location.hostname.includes("-git-")) {
      alert("Authentication is disabled on preview builds. Please use the production site.");
      return;
    }
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  const handleVote = async (foodName, voteType) => {
    const token = localStorage.getItem("menu_token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const foodId = toFoodIdLocal(foodName);
    const previousVote = userVotes[foodId];

    // 1. Determine optimistic outcome
    const newVote = previousVote === voteType ? null : voteType;

    // 2. Update state immediately
    setUserVotes(prev => {
      const next = { ...prev };
      if (newVote === null) delete next[foodId];
      else next[foodId] = newVote;
      return next;
    });

    try {
      const res = await api.post("/vote/castVote", { foodName, voteType });
      if (res.data.success) {
        const votedVote = res.data.data;
        const foodIdKey = votedVote?.foodId || foodId;

        // the below functions syncs the state of the ui which was previously updated 
        setUserVotes(prev => {
          const next = { ...prev };
          if (votedVote?.voteType === null) {
            delete next[foodIdKey];
          } else {
            next[foodIdKey] = votedVote?.voteType;
          }
          return next;
        });
      }
    } catch (err) {
      // if sync fails then the previous vote is restored
      setUserVotes(prev => {
        const next = { ...prev };
        if (previousVote) next[foodId] = previousVote;
        else delete next[foodId];
        return next;
      });

      if (err.response && err.response.status === 401) {
        setShowLoginModal(true);
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
      if (err.response && err.response.status === 404) {
        setOtherMeals(null);
        setError(null);
        return;
      }
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
      if (err.response && err.response.status === 404) {
        setOtherMeals(null);
        setError(null);
        return;
      }
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
              📲 Add to Home Screen
            </Link>
          </>
        )}
      </div>

      {!isLoading && !error && !currentMeal && otherMealsList.length === 0 && (
        <div className="no-menu-message">
          <h2>{isToday ? "Didn't receive the Menu from food sutra" : "No menu found for the asked date"}</h2>
        </div>
      )}

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

      {
        showLoginModal && (
          <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
              <h2>Login Required</h2>
              <p>You need to sign in to vote on menu items.</p>

              <button className="modal-google-btn" onClick={handleGoogleAuth}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Sign in with Google
              </button>

              <button className="modal-close-btn" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
};

