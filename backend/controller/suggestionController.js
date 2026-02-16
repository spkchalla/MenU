import { createSuggestionUtil } from "../utils/suggestionUtils/createSuggestionUtils.js";
import { getAllSuggestionsUtil } from "../utils/suggestionUtils/getAllSuggestionsUtils.js";

export const createSuggestion = async (req, res) => {
  try {
    const { suggestion, type, wantToContribute } = req.body;

    const newSuggestion = await createSuggestionUtil({
      userId: req.user.userId,
      isBanned: req.user.isBanned,
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
    res.status(400).json({
      status: "failed",
      err: {
        errMsg: error.message,
      },
    });
  }
};

export const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await getAllSuggestionsUtil();

    res.status(200).json({
      status: "success",
      data: {
        suggestion: suggestions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      err: {
        errMsg: err.message,
      },
    });
  }
};

export const getSuggestion = async (req, res) => {};

export const banUser = async (req, res) => {};

export const archiveSuggestion = async (req, res) => {};
