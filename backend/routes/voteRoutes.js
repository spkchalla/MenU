import express, { Router } from "express";
import { castVote } from "../controller/voteController.js";
import { protectUser } from "../middleware/middleware.js";

const voteRouter = express.Router();

voteRouter.post("/castVote", protectUser, castVote);

export default voteRouter;