import { Router } from "express";
import userRoutes from "./userRoutes.js";

const router = Router();

// Example route: GET /api/status
router.get("/status", (req, res) => {
    res.json({ message: "API is running smoothly!" });
});

router.use("/users", userRoutes);

export default router;
