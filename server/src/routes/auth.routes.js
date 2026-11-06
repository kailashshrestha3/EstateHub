import express from "express";
import { getMe, login, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
// Get logged-in user
router.get("/me", authenticate, getMe);


export default router