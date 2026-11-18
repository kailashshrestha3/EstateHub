import express from "express";
import { approveProperty, createProperty, deleteProperty, getAllProperties, getAllPropertiesForAdmin, getPendingProperties, getPropertyById, rejectProperty, updateProperty } from "../controllers/property.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { createPropertySchema, updatePropertySchema } from "../validators/property.validator.js";
import { validate } from "../middleware/validate.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = express.Router();

router.get("/", getAllProperties);
router.post("/", authenticate, validate(createPropertySchema), createProperty);
router.get("/admin/pending", authenticate, authorize("admin"), getPendingProperties);
router.get("/admin/all", authenticate, authorize("admin"), getAllPropertiesForAdmin);
router.get("/:id", getPropertyById);
router.put("/:id", authenticate, validate(updatePropertySchema), updateProperty);
router.delete("/:id", authenticate, deleteProperty);
router.patch("/:id/approve", authenticate, authorize("admin"), approveProperty);
router.patch("/:id/reject", authenticate, authorize("admin"), rejectProperty);

export default router;