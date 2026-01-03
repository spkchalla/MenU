import Vote from "../model/voteModel.js";

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Public
export const castVote = async (req, res) => {
    try {
        const { foodId, voteType } = req.body;

        // Validate foodId: must be a non-empty string
        if (typeof foodId !== "string" || !foodId.trim()) {
            return res.status(400).json({ success: false, message: "Invalid or missing 'foodId'" });
        }

        // Validate voteType: must be exactly 'like' or 'dislike'
        if (typeof voteType !== "string" || !["like", "dislike"].includes(voteType)) {
            return res.status(400).json({ success: false, message: "Invalid 'voteType'. Must be 'like' or 'dislike'." });
        }

        const newVote = await Vote.create({
            foodId: foodId.trim(),
            voteType,
        });

        res.status(201).json({ success: true, data: newVote });
    } catch (error) {
        console.error("Vote Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
