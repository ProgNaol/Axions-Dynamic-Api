import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user with the same email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with the same email already exists" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long"});
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid user data" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users= await User.find({})
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2) Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3) Generate JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,  // Make sure to define JWT_SECRET in your .env
            { expiresIn: "1h" }      // Token expires in 1 hour
        );

        // 4) Return token
        return res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * GET user by email
 */
export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email }); // Query by email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * UPDATE user by email
 */
export const updateUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const { name, newEmail } = req.body;
        // 'newEmail' is the updated email you want to set,
        // since we're using the old email to find the user.

        // 1) Find user by the old email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2) Update fields if provided
        if (name) user.name = name;
        if (newEmail) user.email = newEmail; // You can rename or skip if you want
        await user.save();

        return res.json(user);
    } catch (error) {
        console.error("Error updating user by email:", error);
        return res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE user by email
 */
export const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        // findOneAndDelete returns the deleted document or null if none found
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user by email:", error);
        return res.status(500).json({ error: error.message });
    }
};
