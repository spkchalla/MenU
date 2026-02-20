import mongoose from "mongoose";
import { SuggestionModel } from "../../model/suggestionModel.js";

export const getAllSuggestionsUtil = async (filters) => {
  try {
    const pipeline = [];

    // 1️⃣ Always filter archived first
    pipeline.push({ $match: { isArchived: false } });

    // 2️⃣ Match suggestionId if exists
    if (mongoose.Types.ObjectId.isValid(filters.suggestionId)) {
      pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(filters.suggestionId) } });
    }

    // 3️⃣ Join User collection
    pipeline.push({
      $lookup: {
        from: "usermodels",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });

    // 4️⃣ Convert user array → object earlier user =[{}]
    pipeline.push({
      $unwind: "$user",
    });

    // 5️⃣ Apply user filters
    const userMatch = {};

    if (filters.userId && mongoose.Types.ObjectId.isValid(filters.userId)) {
      userMatch["user._id"] = new mongoose.Types.ObjectId(filters.userId);
    }

    if (filters.name) {
      userMatch["user.name"] = { $regex: filters.name, $options: "i" };
    }

    if (filters.email) {
      userMatch["user.email"] = { $regex: filters.email, $options: "i" };
    }

    if (Object.keys(userMatch).length > 0) {
      pipeline.push({ $match: userMatch });
    }

    // 6️⃣ Remove unwanted fields
    pipeline.push({
      $project: {
        __v: 0,
        "user.__v": 0,
      },
    });

    const suggestions = await SuggestionModel.aggregate(pipeline);

    return suggestions;
  } catch (err) {
    const error = new Error(err.message);
    error.statsCode = err.statsCode || 500;
    throw error;
  }
};
