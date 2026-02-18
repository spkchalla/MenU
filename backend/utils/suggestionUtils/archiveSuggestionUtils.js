import mongoose from "mongoose";
// # The Fix: Use "Logical OR" for Export - Cannot overwrite `UserModel` model once compiled
// export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
import { SuggestionModel } from "../../model/suggestionModel.js";

export const archiveSuggestionUtil = async (suggestionId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(suggestionId)) {
      const error = new Error("Invalid suggestion id");
      error.statusCode = 400;
      throw error;
    }

    const suggestion = await SuggestionModel.findById(suggestionId);

    if (!suggestion) {
      const error = new Error("Suggestion doesn't exists");
      error.statusCode = 404;
      throw error;
    }

    suggestion.isArchived = true;

    await suggestion.save();

    return suggestion;
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};
