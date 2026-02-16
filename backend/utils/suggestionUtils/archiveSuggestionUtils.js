import mongoose from "mongoose";
// # The Fix: Use "Logical OR" for Export - Cannot overwrite `UserModel` model once compiled
// export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);
import { SuggestionModel } from "../../model/suggestionModel.js";

export const archiveSuggestionUtil = async (suggestionId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(suggestionId)) {
      throw new Error("Invalid suggestion id");
    }

    const suggestion = await SuggestionModel.findById(suggestionId);

    if (!suggestion) {
      throw new Error("Suggestion doesn't exists");
    }

    suggestion.isArchived = true;

    await suggestion.save();

    return suggestion;
  } catch (err) {
    throw new Error(err.message);
  }
};
