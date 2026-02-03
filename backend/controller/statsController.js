import { topFiveFoods } from "../utils/statsUtils/getDailyTopFoodsUtils.js";
import { bottomThreeFoods } from "../utils/statsUtils/getDailyBottomFoodsUtils.js";
import { mostParticipatedFoods } from "../utils/statsUtils/trendsUtils.js";

export const mostLikedFoods = async (req, res) => {
    try {
        const topFoods = await topFiveFoods();

        if (topFoods.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No votes have been recorded today",
                data: {
                    foods: [],
                    count: 0,
                },
            });
        }

        let message = "Top foods fetched successfully";

        if (topFoods.length < 5) {
            message = `Only ${topFoods.length} food(s) have votes today. No more competitors available.`;
        }

        return res.status(200).json({
            success: true,
            message,
            data: {
                foods: topFoods,
                count: topFoods.length,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch top foods",
        });
    }
};

export const mostDislikedFoods = async (req, res) => {
    try {
        const bottomFoods = await bottomThreeFoods();

        if (bottomFoods.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Not enough votes to determine disliked foods today.",
                data: {
                    foods: [],
                    count: 0,
                },
            });
        }

        let message = "Bottom foods fetched successfully";

        if (bottomFoods.length < 3) {
            message = `Only ${bottomFoods.length} food(s) qualify as disliked performers today.`;
        }

        return res.status(200).json({
            success: true,
            message,
            data: {
                foods: bottomFoods,
                count: bottomFoods.length,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bottom foods",
        });
    }
};

export const getTrends = async (req, res) => {
    try {
        const trends = await mostParticipatedFoods();

        if (trends.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No votes recorded this week.",
                data: {
                    foods: [],
                    count: 0,
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Trends fetched successfully",
            data: {
                foods: trends,
                count: trends.length,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch trends",
        });
    }
};