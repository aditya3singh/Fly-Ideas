const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    bio: {
        type: String,
        maxlength: [500, "Bio cannot exceed 500 characters"],
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    followers: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    bookmarks: [{
        type: mongoose.Types.ObjectId,
        ref: "Post"
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {
    timestamps: true
});

// Index for better performance
userSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model("User", userSchema);