import express from "express";
import { castVote } from "../controller/voteController.js";

const router = express.Router();

router.post("/castVote", castVote);

export default router;
