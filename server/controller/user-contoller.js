const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "30d"
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email, and password"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email 
                    ? "Email already registered" 
                    : "Username already taken"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("bookmarks", "title slug thumbnail author createdAt")
            .populate("following", "username avatar bio")
            .populate("followers", "username avatar bio");

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { username, bio } = req.body;
        const updates = {};

        if (username) {
            // Check if username is already taken
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: req.user.id } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken"
                });
            }
            updates.username = username;
        }

        if (bio !== undefined) updates.bio = bio;
        if (req.file) updates.avatar = req.file.path;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get all users (for admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get user by username
// @route   GET /api/users/:username
// @access  Public
const getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select("-password -email")
            .populate("followers", "username avatar")
            .populate("following", "username avatar");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/:userId/follow
// @access  Private
const toggleFollow = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user.id;

        if (targetUserId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
            isFollowing: !isFollowing
        });
    } catch (error) {
        console.error("Toggle follow error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    signUp,
    logIn,
    getProfile,
    updateProfile,
    getAllUsers,
    getUserByUsername,
    toggleFollow
};