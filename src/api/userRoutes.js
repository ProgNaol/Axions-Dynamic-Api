import {
    getUserByEmail,
    updateUserByEmail,
    deleteUserByEmail,
    createUser,
    getAllUsers,
    loginUser
} from "../controllers/userController.js";
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {validate} from "../middleware/validate.js";
import {check} from "express-validator";

const router = Router();

router.post("/register", [
        check("name").notEmpty().withMessage("Name is required"),
        check("email").isEmail().withMessage("Invalid email"),
        check("password").isLength({ min: 8 }).withMessage("Password too short")
    ],
    validate,
    createUser);

// GET /api/users -> Get all users
router.get("/getusers", protect, getAllUsers);

router.post("/login",
    [
        check("email").notEmpty().withMessage("Email is required"),
        check("password").notEmpty().withMessage("Password is required")
    ], validate, loginUser);


// New routes by email
router.get("/:email", protect, getUserByEmail);
router.put("/:email", protect, updateUserByEmail);
router.delete("/:email", protect, deleteUserByEmail);


export default router;