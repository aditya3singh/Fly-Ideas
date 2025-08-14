const express = require("express");
const {
    getAllPosts,
    getFeaturedPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleBookmark,
    getPostsByUser,
    getMyPosts,
    getCategories,
    getTags
} = require("../controller/blog-controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const { thumbnailUpload } = require("../utils/upload");

const postRouter = express.Router();

// Public routes
postRouter.get("/", getAllPosts);
postRouter.get("/featured", getFeaturedPosts);
postRouter.get("/categories", getCategories);
postRouter.get("/tags", getTags);
postRouter.get("/user/:username", getPostsByUser);
postRouter.get("/:slug", getPostBySlug);

// Private routes
postRouter.post("/", authMiddleware, thumbnailUpload.single("thumbnail"), createPost);
postRouter.put("/:id", authMiddleware, thumbnailUpload.single("thumbnail"), updatePost);
postRouter.delete("/:id", authMiddleware, deletePost);
postRouter.post("/:id/like", authMiddleware, toggleLike);
postRouter.post("/:id/bookmark", authMiddleware, toggleBookmark);
postRouter.get("/my/posts", authMiddleware, getMyPosts);

module.exports = postRouter;