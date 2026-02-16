import express from "express";
import { googleLogin, googleCallback } from "../controller/auth.controller.js";

const oauthRouter = express.Router();

oauthRouter.get("/google", googleLogin);
oauthRouter.get("/google/callback", googleCallback);
export default oauthRouter;
