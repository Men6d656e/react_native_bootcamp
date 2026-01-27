import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { Config } from "../config/config.js";
const generateToken = (userId) => {
    return jwt.sign({ userId }, Config.JWT_SECRET, { expiresIn: "15d" });
};
export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password should be at least 6 characters long" });
        }
        if (username.length < 3) {
            return res
                .status(400)
                .json({ message: "Username should be at least 3 characters long" });
        }
        // check if user already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }
        // get random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        const user = new User({
            email,
            username,
            password,
            profileImage,
        });
        await user.save();
        const token = generateToken(user._id.toString());
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.log("Error in register controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields are required" });
        // check if user exists
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = generateToken(user._id.toString());
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.log("Error in login controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = async (_req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=auth.controller.js.map