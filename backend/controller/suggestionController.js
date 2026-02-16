import { createSuggestionUtil } from "../utils/suggestionUtils/createSuggestionUtils.js";

export const createSuggestion = async (req, res) => {
  try {
    const { suggestion, type, wantToContribute } = req.body;

    const newSuggestion = await createSuggestionUtil(
      suggestion,
      type,
      wantToContribute,
    );
    console.log("newSuggestion=======>", newSuggestion);

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

export const getAllSuggestions = async (req, res) => {};

export const getSuggestion = async (req, res) => {};

export const banUser = async (req, res) => {};

export const archiveSuggestion = async (req, res) => {};
