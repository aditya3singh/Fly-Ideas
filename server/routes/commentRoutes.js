const express = require("express");
const {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    toggleLikeComment
} = require("../controller/commentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const commentRouter = express.Router();

// Comment routes for posts
commentRouter.get("/posts/:postId/comments", getComments);
commentRouter.post("/posts/:postId/comments", authMiddleware, createComment);

// Individual comment routes
commentRouter.put("/:id", authMiddleware, updateComment);
commentRouter.delete("/:id", authMiddleware, deleteComment);
commentRouter.post("/:id/like", authMiddleware, toggleLikeComment);

module.exports = commentRouter;