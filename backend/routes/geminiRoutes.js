import { generateJsonFromText } from "../controller/geminiController.js";

import express from "express";
const geminiRouter = express.Router();

geminiRouter.post("/generateJsonText", express.text(), generateJsonFromText);

export default geminiRouter;