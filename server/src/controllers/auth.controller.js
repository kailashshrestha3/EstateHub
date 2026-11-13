import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import RefreshToken from "../models/refresh-token.model.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import hashToken from "../utils/hashToken.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username, email, password: hashedPassword
        })

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }

};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateToken(user._id, user.role);

        // 4. Generate refresh token
        const refreshToken = generateRefreshToken();

        // 5. Hash refresh token
        const tokenHash = hashToken(refreshToken);

        // 6. Save hashed refresh token
        await RefreshToken.create({
            user: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // 7. Send refresh token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth"
        });

        // 4. Send response
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        // 1. Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        // 2. Hash the received token
        const tokenHash = hashToken(refreshToken);

        // 3. Find the stored token
        const storedToken = await RefreshToken.findOne({
            tokenHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() }
        });

        if (!storedToken) {
            return res.status(401).json({
                message: "Invalid or expired refresh token"
            });
        }

        // 4. Find the user
        const user = await User.findById(storedToken.user);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // 5. Revoke old refresh token
        storedToken.revokedAt = new Date();
        await storedToken.save();

        // 6. Generate new tokens
        const newAccessToken = generateToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken();

        // 7. Store new refresh token hash
        await RefreshToken.create({
            user: user._id,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // 8. Set new refresh cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/api/auth"
        });

        return res.status(200).json({
            message: "Access token refreshed",
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(500).json({
            message: "Token refresh failed",
            error: error.message
        });
    }
};
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const tokenHash = hashToken(refreshToken);

            await RefreshToken.findOneAndUpdate(
                {
                    tokenHash,
                    revokedAt: null
                },
                {
                    $set: { revokedAt: new Date() }
                }
            );
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/auth"
        });

        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed"
        });
    }
};