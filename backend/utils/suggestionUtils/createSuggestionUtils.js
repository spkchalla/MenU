import { SuggestionModel } from "../../model/suggestionModel.js";

export const createSuggestionUtil = async (
  suggestion,
  type,
  wantToContribute,
) => {
  try {
    if (!suggestion || !type || ![false, true].includes(wantToContribute)) {
      throw new Error("Suggestion ,type and want to continue cannot be empty");
    }

    const newSuggestion = await SuggestionModel.create({
      suggestion,
      type,
      wantToContribute,
    });

    return newSuggestion;
  } catch (err) {
    throw new Error("Could not create suggestion: " + err.message);
  }
};
