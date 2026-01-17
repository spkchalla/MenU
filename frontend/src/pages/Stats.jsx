import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Stats.css";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

export const Stats = () => {
    const [topFoods, setTopFoods] = useState([]);
    const [bottomFoods, setBottomFoods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTopFoods = async () => {
        try {
            const res = await api.get("/stats/topFoods");
            setTopFoods(res.data.data.foods);
        } catch (err) {
            console.error("Error in fetching top foods: ", err);
            throw new Error("Top foods fetch failed");
        }
    }

    const fetchBottomFoods = async () => {
        try {
            const res = await api.get("/stats/bottomFoods");
            setBottomFoods(res.data.data.foods);
        } catch (err) {
            console.error("Error in fetching bottom foods: ", err);
            throw new Error("Bottom foods fetch failed");
        }
    }

    useEffect(() => {
        const loadStats = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await Promise.all([fetchTopFoods(), fetchBottomFoods()]);
            } catch (err) {
                setError("Failed to load today's highlights");
            } finally {
                setIsLoading(false);
            }
        };

        loadStats();
    }, []);

    if (isLoading) {
        return <h2 className="loading-text">Analyzing today's votes...</h2>;
    }

    if (error) {
        return <h2 className="error-text">{error}</h2>;
    }

    return (
        <div className="stats-container">
            <Link to="/" className="stats-back-btn">
                &larr; Back
            </Link>
            <header>
                <h1 className="stats-header">Daily Highlights</h1>
                <p className="stats-subtitle">What's trending in the mess today</p>
            </header>

            <div className="stats-grid">
                {/* Most Loved Section */}
                <div className="stats-section">
                    <h2>🔥 Most Loved</h2>
                    {topFoods.length === 0 ? (
                        <p className="empty-text">No favorites yet! Start voting.</p>
                    ) : (
                        <div className="ranked-list">
                            {topFoods.map((food, index) => (
                                <div key={food.foodId} className="ranked-item">
                                    <div className="rank">{index + 1}</div>
                                    <div className="food-info">
                                        <div className="food-name">{food.displayName.toLowerCase()}</div>
                                        <div className="food-meta">
                                            <span className="like-percentage">👍 {food.likePercentage}%</span>
                                            <span className="vote-pill">{food.totalVotes} votes</span>
                                            <span className="vote-pill">Score: {food.score}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Least Liked Section */}
                <div className="stats-section least-liked">
                    <h2>💔 Least Liked</h2>
                    {bottomFoods.length === 0 ? (
                        <p className="empty-text">Everyone seems happy today!</p>
                    ) : (
                        <div className="ranked-list">
                            {bottomFoods.map((food, index) => (
                                <div key={food.foodId} className="ranked-item">
                                    <div className="rank">{index + 1}</div>
                                    <div className="food-info">
                                        <div className="food-name">{food.displayName.toLowerCase()}</div>
                                        <div className="food-meta">
                                            <span className="like-percentage">👍 {food.likePercentage}%</span>
                                            <span className="vote-pill">{food.totalVotes} votes</span>
                                            <span className="vote-pill">Score: {food.score}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};