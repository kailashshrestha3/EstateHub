import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import propertyRoutes from "./routes/property.route.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

app.post("/post", (req, res) => {
    res.json({
        data: req.body,
        message: "success",
    });
});

export default app;