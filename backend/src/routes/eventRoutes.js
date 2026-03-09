import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createEventRules, updateEventRules } from "../validators/eventValidators.js";
import { listEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";

const router = Router();

router.get("/", protect, listEvents);
router.post("/", protect, requireRole("admin"), createEventRules, validate, createEvent);
router.put("/:id", protect, requireRole("admin"), updateEventRules, validate, updateEvent);
router.delete("/:id", protect, requireRole("admin"), deleteEvent);

export default router;
