import express from "express";
import { getMorningBrief } from "../controllers/brief.controller.js";

const router = express.Router();

router.get("/morning", getMorningBrief);

export default router;