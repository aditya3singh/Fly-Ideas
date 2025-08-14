const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: [true, "Comment content is required"],
        trim: true,
        maxlength: [1000, "Comment cannot exceed 1000 characters"]
    },
    parentComment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    replies: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date
}, {
    timestamps: true
});

// Index for better performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

module.exports = mongoose.model("Comment", commentSchema);