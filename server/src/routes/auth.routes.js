import express from "express";
import { register } from "../controllers/auth.controller.js";
import { registerSchema } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

export default router