import { body } from "express-validator";

export const createEventRules = [
  body("name").trim().isLength({ min: 3 }).withMessage("Event name required"),
  body("date").notEmpty().withMessage("Date required"),
  body("location").optional().trim().escape(),
  body("type").optional().trim().escape(),
  body("keywords").optional().isArray().withMessage("Keywords must be array"),
  body("description").optional().trim(),
];

export const updateEventRules = [
  body("name").optional().trim().isLength({ min: 3 }),
  body("date").optional().notEmpty(),
  body("keywords").optional().isArray(),
];
