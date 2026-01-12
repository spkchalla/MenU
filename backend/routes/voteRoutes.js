import express, { Router } from "express";
import { castVote } from "../controller/voteController";
import { protectUser } from "../middleware/middleware";

const voteRouter = express.Router();

voteRouter.post("/castVote", protectUser, castVote);

export default voteRouter;