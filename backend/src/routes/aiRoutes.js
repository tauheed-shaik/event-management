import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { generateEventDescRules } from "../validators/aiValidators.js";
import { validate } from "../middleware/validate.js";
import { generateDescription } from "../controllers/aiController.js";

const router = Router();

router.post("/generate-event-description", protect, requireRole("admin"), generateEventDescRules, validate, generateDescription);

export default router;
