const mongoose = require("mongoose");
const Post = require("../model/Blog");
const User = require("../model/User");
const Comment = require("../model/Comment");

// @desc    Get all published posts
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const tags = req.query.tags;
        const search = req.query.search;
        const sort = req.query.sort || "latest";

        // Build query
        let query = { status: "published" };

        if (category) {
            query.category = category.toLowerCase();
        }

        if (tags) {
            const tagArray = tags.split(",").map(tag => tag.trim().toLowerCase());
            query.tags = { $in: tagArray };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ];
        }

        // Build sort
        let sortQuery = {};
        switch (sort) {
            case "latest":
                sortQuery = { publishedAt: -1 };
                break;
            case "oldest":
                sortQuery = { publishedAt: 1 };
                break;
            case "popular":
                sortQuery = { likes: -1, views: -1 };
                break;
            case "views":
                sortQuery = { views: -1 };
                break;
            default:
                sortQuery = { publishedAt: -1 };
        }

        const posts = await Post.find(query)
            .populate("author", "username avatar bio")
            .select("-content")
            .skip(skip)
            .limit(limit)
            .sort(sortQuery);

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get all posts error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
const getFeaturedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ 
            status: "published", 
            featured: true 
        })
            .populate("author", "username avatar")
            .select("-content")
            .sort({ publishedAt: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error("Get featured posts error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ 
            slug: req.params.slug,
            status: "published"
        })
            .populate("author", "username avatar bio followers")
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "username avatar"
                }
            });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error("Get post by slug error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { title, content, category, tags, status, excerpt, seoTitle, seoDescription } = req.body;

        // Validation
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, content, and category are required"
            });
        }

        const postData = {
            title,
            content,
            category: category.toLowerCase(),
            author: req.user.id,
            status: status || "draft"
        };

        if (excerpt) postData.excerpt = excerpt;
        if (seoTitle) postData.seoTitle = seoTitle;
        if (seoDescription) postData.seoDescription = seoDescription;
        if (req.file) postData.thumbnail = req.file.path;

        if (tags) {
            postData.tags = Array.isArray(tags) 
                ? tags.map(tag => tag.toLowerCase().trim())
                : tags.split(",").map(tag => tag.toLowerCase().trim());
        }

        const post = await Post.create(postData);
        await post.populate("author", "username avatar");

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check ownership
        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this post"
            });
        }

        const { title, content, category, tags, status, excerpt, seoTitle, seoDescription } = req.body;
        const updates = {};

        if (title) updates.title = title;
        if (content) updates.content = content;
        if (category) updates.category = category.toLowerCase();
        if (status) updates.status = status;
        if (excerpt) updates.excerpt = excerpt;
        if (seoTitle) updates.seoTitle = seoTitle;
        if (seoDescription) updates.seoDescription = seoDescription;
        if (req.file) updates.thumbnail = req.file.path;

        if (tags) {
            updates.tags = Array.isArray(tags) 
                ? tags.map(tag => tag.toLowerCase().trim())
                : tags.split(",").map(tag => tag.toLowerCase().trim());
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate("author", "username avatar");

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (error) {
        console.error("Update post error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check ownership
        if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this post"
            });
        }

        // Delete associated comments
        await Comment.deleteMany({ postId: post._id });

        // Remove from user bookmarks
        await User.updateMany(
            { bookmarks: post._id },
            { $pull: { bookmarks: post._id } }
        );

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Delete post error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Toggle like post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const isLiked = post.likes.includes(req.user.id);

        if (isLiked) {
            post.likes.pull(req.user.id);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: isLiked ? "Post unliked" : "Post liked",
            isLiked: !isLiked,
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error("Toggle like error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Toggle bookmark post
// @route   POST /api/posts/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const user = await User.findById(req.user.id);
        const isBookmarked = user.bookmarks.includes(post._id);

        if (isBookmarked) {
            user.bookmarks.pull(post._id);
        } else {
            user.bookmarks.push(post._id);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: isBookmarked ? "Bookmark removed" : "Post bookmarked",
            isBookmarked: !isBookmarked
        });
    } catch (error) {
        console.error("Toggle bookmark error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:username
// @access  Public
const getPostsByUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ 
            author: user._id,
            status: "published"
        })
            .populate("author", "username avatar")
            .select("-content")
            .skip(skip)
            .limit(limit)
            .sort({ publishedAt: -1 });

        const total = await Post.countDocuments({ 
            author: user._id,
            status: "published"
        });

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get posts by user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get user's own posts (including drafts)
// @route   GET /api/posts/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        let query = { author: req.user.id };
        if (status) {
            query.status = status;
        }

        const posts = await Post.find(query)
            .select("-content")
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get my posts error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get categories
// @route   GET /api/posts/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Post.distinct("category", { status: "published" });
        
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Get popular tags
// @route   GET /api/posts/tags
// @access  Public
const getTags = async (req, res) => {
    try {
        const tags = await Post.aggregate([
            { $match: { status: "published" } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.status(200).json({
            success: true,
            tags: tags.map(tag => ({ name: tag._id, count: tag.count }))
        });
    } catch (error) {
        console.error("Get tags error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
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
};