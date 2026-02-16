import { SuggestionModel } from "../../model/suggestionModel.js";

export const getAllSuggestionsUtil = async () => {
  try {
    const suggestions = await SuggestionModel.find({ isArchived: false })
      .populate("userId", "_id name email")
      .select("-__v");

    return suggestions;
  } catch (err) {
    throw new Error(err.message);
  }
};
