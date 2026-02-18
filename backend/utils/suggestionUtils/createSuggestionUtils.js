import { SuggestionModel } from "../../model/suggestionModel.js";
import UserModel from "../../model/userModel.js";

export const createSuggestionUtil = async ({ userId, suggestion, type, wantToContribute }) => {
  try {
    if (!suggestion || !type) {
      throw new Error("Suggestion and type cannot be empty");
    }

    // Fetch the current user from the database to get real-time ban status
    // This ensures banned users cannot submit suggestions even if they have a valid JWT
    const user = await UserModel.findById(userId).select("isBanned");
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isBanned) {
      throw new Error("Action denied: User is banned from making suggestions");
    }

    let canContribute = ["bug", "feature request"].includes(type) ? wantToContribute : false;

    const newSuggestion = await SuggestionModel.create({
      userId,
      suggestion,
      type,
      wantToContribute: canContribute,
    });

    return newSuggestion;
  } catch (err) {
    throw new Error(err.message);
  }
};
