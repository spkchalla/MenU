import { SuggestionModel } from "../../model/suggestionModel.js";

export const createSuggestionUtil = async ({ userId, isBanned, suggestion, type, wantToContribute }) => {
  try {
    if (!suggestion || !type) {
      throw new Error("Suggestion and type cannot be empty");
    }

    if (isBanned) {
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
