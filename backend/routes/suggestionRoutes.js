import express from "express";
const app = express();

import { protectAdmin, protectUser } from "../middleware/middleware.js";

import {
  createSuggestion,
  getAllSuggestions,
  getSuggestion,
  banUser,
  archiveSuggestion,
} from "../controller/suggestionController.js";

const suggestionRouter = express.Router();

app.use(protectUser);

/** USER ROUTES **/

suggestionRouter.post("/createSuggestion", createSuggestion);

/*** ADMIN ROUTES **/

app.use(protectAdmin);

suggestionRouter.get("/allSuggestions", getAllSuggestions);

suggestionRouter.get("/getSuggestion", getSuggestion);

suggestionRouter.patch("/banUser/id", banUser);

suggestionRouter.patch("/archiveSuggestion/:id", archiveSuggestion);

export default suggestionRouter;
