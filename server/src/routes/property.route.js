import express from "express";
import { createProperty, getAllProperties } from "../controllers/property.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { createPropertySchema } from "../validators/property.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", getAllProperties);
router.post("/", authenticate, validate(createPropertySchema), createProperty);

export default router;