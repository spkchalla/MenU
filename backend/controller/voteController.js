import { castVoteLogic } from "../utils/voteUtils/castVoteUtil.js";

// @desc    Cast a vote
// @route   POST /api/votes/castVote
// @access  Public
export const castVote = async (req, res) => {
    try {
        const newVote = await castVoteLogic(req.body);

        res.status(201).json({ success: true, data: newVote });
    } catch (error) {
        console.error("Vote Error:", error.message);

        let statusCode = 500;

        if (
            error.message.includes("Invalid") ||
            error.message.includes("missing")
        ) {
            statusCode = 400;
        }

        res.status(statusCode).json({ success: false, message: error.message });
    }
};
