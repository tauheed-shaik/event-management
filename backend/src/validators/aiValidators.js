import { body } from "express-validator";

export const generateEventDescRules = [
  body("name").trim().isLength({ min: 3 }).withMessage("Event name required"),
  body("date").notEmpty().withMessage("Date required"),
  body("keywords").optional().isArray().withMessage("Keywords must be array"),
];
