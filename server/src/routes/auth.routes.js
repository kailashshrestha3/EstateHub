import express from "express";
import { getMe, login, logout, refreshAccessToken, register } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout)
// Get logged-in user
router.get("/me", authenticate, getMe);

router.post("/refresh", refreshAccessToken);

router.get(
    "/admin-test",
    authenticate,
    authorize("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome Admin!",
            user: req.user
        });
    }
);
export default router