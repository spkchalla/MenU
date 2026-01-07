import Vote from "../../model/voteModel.js";

export const castVoteLogic = async (body) => {
    try {
        const { menuId, voteType } = body;

        // 1. Validate menuId
        if (typeof menuId !== "string" || !menuId.trim()) {
            throw new Error("Invalid or missing 'menuId'");
        }

        // 2. Validate voteType
        if (
            typeof voteType !== "string" ||
            !["like", "dislike"].includes(voteType)
        ) {
            throw new Error("Invalid 'voteType'. Must be 'like' or 'dislike'.");
        }

        // 3. Create the vote
        const newVote = await Vote.create({
            menuId: menuId.trim(),
            voteType,
        });

        return newVote;
    } catch (error) {
        // Throw error to controller
        throw error;
    }
};
