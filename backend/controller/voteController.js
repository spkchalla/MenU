import { castVoteUtil } from "../utils/voteUtils/castVoteUtil.js";

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Public
export const castVote = async (req, res) => {
    try {
        const { foodId, voteType } = req.body;

        const newVote = await castVoteUtil(foodId, voteType);

        res.status(201).json({ success: true, data: newVote });
    } catch (error) {
        const statusCode = error.status || 500;

        res.status(statusCode).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};
