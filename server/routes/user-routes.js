const express = require("express");
const { 
    signUp, 
    logIn, 
    getProfile, 
    updateProfile, 
    getAllUsers, 
    getUserByUsername, 
    toggleFollow 
} = require("../controller/user-contoller");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { avatarUpload } = require("../utils/upload");

const userRouter = express.Router();

// Auth routes
userRouter.post("/signup", signUp);
userRouter.post("/login", logIn);

// Profile routes
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.put("/profile", authMiddleware, avatarUpload.single("avatar"), updateProfile);

// User management routes
userRouter.get("/", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get("/:username", getUserByUsername);
userRouter.post("/:userId/follow", authMiddleware, toggleFollow);

module.exports = userRouter;