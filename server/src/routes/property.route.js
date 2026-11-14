import express from "express";
import { createProperty } from "../controllers/property.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createProperty);

export default router;