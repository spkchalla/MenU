import { archiveSuggestionUtil } from "../utils/suggestionUtils/archiveSuggestionUtils.js";
import { bannUserUtil } from "../utils/suggestionUtils/bannUserUtils.js";
import { createSuggestionUtil } from "../utils/suggestionUtils/createSuggestionUtils.js";
import { getAllSuggestionsUtil } from "../utils/suggestionUtils/getAllSuggestionsUtils.js";

export const createSuggestion = async (req, res) => {
  try {
    const { suggestion, type, wantToContribute } = req.body;

    const newSuggestion = await createSuggestionUtil({
      userId: req.user.userId,
      suggestion,
      type,
      wantToContribute,
    });

    return res.status(201).json({
      success: true,
      message: "Suggestion created successfully",
      data: {
        suggestion: newSuggestion,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error(err);
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong. Please try again later.",
    });
  }
};

export const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await getAllSuggestionsUtil(req.query);

    return res.status(200).json({
      success: true,
      message: "Suggestions fetched successfully",
      data: {
        suggestions,
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;

    console.error(err);
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong. Please try again later.",
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const bannedUser = await bannUserUtil(userId);

    return res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: {
        user: bannedUser,
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    console.error(err);
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong. Please try again later.",
    });
  }
};

export const archiveSuggestion = async (req, res) => {
  try {
    const archivedSuggestion = await archiveSuggestionUtil(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Suggestion archived successfully",
      data: {
        suggestion: archivedSuggestion,
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    console.error(err);
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong. Please try again later.",
    });
  }
};
