import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { registerForEvent, myRegistrations } from "../controllers/registrationController.js";

const router = Router();

router.get("/my", protect, requireRole("user","admin"), myRegistrations);
router.post("/:eventId", protect, requireRole("user","admin"), registerForEvent);

export default router;
