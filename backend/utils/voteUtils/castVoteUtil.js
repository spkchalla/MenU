import mongoose from "mongoose";
import Vote from "../../model/voteModel.js";
import WeeklyMenu from "../../model/menuModel.js";

export const castVoteLogic = async (body) => {
    const { menuId, voteType } = body;

    // 1. Validate menuId: must be a non-empty string and a valid ObjectId
    if (
        typeof menuId !== "string" ||
        !menuId.trim() ||
        !mongoose.Types.ObjectId.isValid(menuId.trim())
    ) {
        const err = new Error("Invalid or missing 'menuId'");
        err.status = 400;
        throw err;
    }

    // 2. Validate voteType
    if (
        typeof voteType !== "string" ||
        !["like", "dislike"].includes(voteType)
    ) {
        const err = new Error(
            "Invalid 'voteType'. Must be 'like' or 'dislike'."
        );
        err.status = 400;
        throw err;
    }

    const trimmedMenuId = menuId.trim();

    // 3. Ensure the referenced WeeklyMenu exists
    const menu = await WeeklyMenu.findById(trimmedMenuId);
    if (!menu) {
        const err = new Error("Referenced menu not found");
        err.status = 400;
        throw err;
    }

    // 4. Create the vote
    const newVote = await Vote.create({
        menuId: trimmedMenuId,
        voteType,
    });

    return newVote;
};
