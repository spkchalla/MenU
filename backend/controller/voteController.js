import Vote from "../model/voteModel.js";

// @desc    Cast a vote
// @route   POST /api/votes
// @access  Public
export const castVote = async (req, res) => {
    try {
        const { foodId, voteType } = req.body;

        if (!foodId || !voteType) {
            return res
                .status(400)
                .json({ success: false, message: "Missing fields" });
        }

        const newVote = await Vote.create({
            foodId,
            voteType,
        });

        res.status(201).json({ success: true, data: newVote });
    } catch (error) {
        console.error("Vote Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
