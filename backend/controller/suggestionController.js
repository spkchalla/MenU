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

    res.status(201).json({
      status: "success",
      data: {
        suggestion: newSuggestion,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      status: "failed",
      err: {
        errMsg: error.message,
      },
    });
  }
};

export const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await getAllSuggestionsUtil(req.query);

    res.status(200).json({
      status: "success",
      data: {
        suggestion: suggestions,
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "failed",
      err: {
        errMsg: err.message,
      },
    });
  }
};

export const banUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const bannedUser = await bannUserUtil(userId);

    res.status(200).json({
      status: "success",
      data: {
        user: bannedUser,
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "failed",
      err: {
        errMsg: err.message,
      },
    });
  }
};

export const archiveSuggestion = async (req, res) => {
  try {
    const archivedSuggestion = await archiveSuggestionUtil(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        suggestion: archivedSuggestion,
      },
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: "failed",
      err: {
        errMsg: err.message,
      },
    });
  }
};
