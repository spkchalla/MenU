import express, { Router } from "express";
import { castVote, getUserTodayVotes } from "../controller/voteController.js";
import { protectUser } from "../middleware/middleware.js";

const voteRouter = express.Router();

voteRouter.post("/castVote", protectUser, castVote);
voteRouter.get("/myTodayVotes", protectUser, getUserTodayVotes);

export default voteRouter;