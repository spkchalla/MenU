import express from "express";
import { castVote } from "../controller/voteController.js";

const router = express.Router();

router.post("/", castVote);

export default router;
