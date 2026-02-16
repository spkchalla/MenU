import express from "express";

import { protectAdmin, protectUser } from "../middleware/middleware.js";

import {
  createSuggestion,
  getAllSuggestions,
  getSuggestion,
  banUser,
  archiveSuggestion,
} from "../controller/suggestionController.js";

const suggestionRouter = express.Router();

suggestionRouter.use(protectUser);

/** USER ROUTES **/

suggestionRouter.post("/createSuggestion", protectUser, createSuggestion);

/*** ADMIN ROUTES **/

suggestionRouter.use(protectAdmin);

suggestionRouter.get("/allSuggestions", getAllSuggestions);

suggestionRouter.get("/getSuggestion", getSuggestion);

suggestionRouter.patch("/banUser/id", banUser);

suggestionRouter.patch("/archiveSuggestion/:id", archiveSuggestion);

export default suggestionRouter;
