import Vote from "../../model/voteModel.js";
import FoodRegister from "../../model/foodRegisterModel.js";

export const castVoteLogic = async (body) => {
    // 1. Get foodId instead of menuId
    const { foodId, voteType } = body;

    // 2. Validate foodId: must be a non-empty string (No ObjectId check needed)
    if (!foodId || typeof foodId !== "string" || !foodId.trim()) {
        const err = new Error("Invalid or missing 'foodId'");
        err.status = 400;
        throw err;
    }

    // 3. Validate voteType
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

    const trimmedFoodId = foodId.trim();

    // 4. Ensure the food exists in FoodRegister
    const foodExists = await FoodRegister.findOne({ foodId: trimmedFoodId });

    if (!foodExists) {
        const err = new Error(
            `Food item '${trimmedFoodId}' not found in registry`
        );
        err.status = 404;
        throw err;
    }

    // 5. Create the vote
    const newVote = await Vote.create({
        foodId: trimmedFoodId,
        voteType,
    });

    return newVote;
};
