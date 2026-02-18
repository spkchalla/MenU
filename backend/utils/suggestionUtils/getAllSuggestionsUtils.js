import { SuggestionModel } from "../../model/suggestionModel.js";
import UserModel from "../../model/userModel.js";

export const getAllSuggestionsUtil = async (filters) => {
  try {
    const query = { isArchived: false };

    if (filters.suggestionId) {
      query._id = filters.suggestionId;
    }

    if (filters.userId) {
      query.userId = filters.userId; // may be overridden below; handled via $and
    }

    // name & email does not exist in suggestion collection hence we've
    // to query on user collection and get the ids then filter the suggestions

    if (filters.email || filters.name) {
      const userQuery = {};

      if (filters.name) {
        userQuery.name = { $regex: filters.name, $options: "i" };
      }

      if (filters.email) {
        userQuery.email = { $regex: filters.email, $options: "i" };
      }

      const users = await UserModel.find(userQuery).select("_id");
      const userIds = users.map((user) => user._id);

      // Intersect: if a direct userId filter was already set, keep only that user if it's in the set
      if (query.userId) {
        query.$and = [{ userId: query.userId }, { userId: { $in: userIds } }];
        delete query.userId;
      } else {
        query.userId = { $in: userIds };
      }
    }

    const suggestions = await SuggestionModel.find(query).populate("userId", "_id name email").select("-__v");

    return suggestions;
  } catch (err) {
    const error = new Error(err.message);
    error.statsCode = err.statsCode || 500;
    throw error;
  }
};
