import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

// GET recommendation
router.get("/:userId", getRecommendations);

export default router;