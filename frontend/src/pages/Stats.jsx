import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Stats.css";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
});

export const Stats = () => {
    const [trends, setTrends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTrends = async () => {
        try {
            const res = await api.get("/stats/trends");
            // Process data to add calculated fields if needed
            const trendsData = res.data.data.foods.map(food => ({
                ...food,
                score: food.likes - food.dislikes,
                likePercentage: food.totalVotes > 0 ? Math.round((food.likes / food.totalVotes) * 100) : 0
            })).sort((a, b) => {
                if (b.totalVotes !== a.totalVotes) {
                    return b.totalVotes - a.totalVotes;
                }
                return b.likes - a.likes;
            });
            setTrends(trendsData);
        } catch (err) {
            console.error("Error in fetching trends: ", err);
            throw new Error("Trends fetch failed");
        }
    }

    useEffect(() => {
        const loadStats = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await fetchTrends();
            } catch (err) {
                setError("Failed to load today's highlights");
            } finally {
                setIsLoading(false);
            }
        };

        loadStats();
    }, []);

    if (isLoading) {
        return <h2 className="loading-text">Analyzing today's trends...</h2>;
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
                <h1 className="stats-header">Daily Trends</h1>
                <p className="stats-subtitle">Most participated foods in the mess today</p>
            </header>

            <div className="stats-grid single-col">
                <div className="stats-section">
                    <h2>📈 Trending Now</h2>
                    {trends.length === 0 ? (
                        <p className="empty-text">No votes yet! Start voting to see trends.</p>
                    ) : (
                        <div className="ranked-list">
                            {trends.map((food, index) => (
                                <div key={food.foodId} className="ranked-item">
                                    <div className="food-info">
                                        <div className="food-name">{food.displayName.toLowerCase()}</div>
                                        <div className="food-meta">
                                            <span className="vote-pill">{food.totalVotes} votes</span>
                                            <span className="vote-pill like-count">👍 {food.likes}</span>
                                            <span className="vote-pill dislike-count">👎 {food.dislikes}</span>
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