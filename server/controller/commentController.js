const Comment = require("../model/Comment");
const Post = require("../model/Blog");

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
const getComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await Comment.find({ 
            postId: req.params.postId,
            parentComment: null
        })
            .populate("author", "username avatar")
            .populate({
                path: "replies",
                populate: {
                    path: "author",
                    select: "username avatar"
                }
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Comment.countDocuments({ 
            postId: req.params.postId,
            parentComment: null
        });

        res.status(200).json({
            success: true,
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get comments error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Create new comment
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = async (req, res) => {
    try {
        const { content, parentComment } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        // Check if post exists
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // If it's a reply, check if parent comment exists
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(404).json({
                    success: false,
                    message: "Parent comment not found"
                });
            }
        }

        const comment = await Comment.create({
            postId: req.params.postId,
            author: req.user.id,
            content: content.trim(),
            parentComment: parentComment || null
        });

        await comment.populate("author", "username avatar");

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        // If it's a reply, add to parent's replies array
        if (parentComment) {
            await Comment.findByIdAndUpdate(
                parentComment,
                { $push: { replies: comment._id } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        console.error("Create comment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Check ownership
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this comment"
            });
        }

        comment.content = content.trim();
        comment.isEdited = true;
        comment.editedAt = new Date();
        await comment.save();

        await comment.populate("author", "username avatar");

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        });
    } catch (error) {
        console.error("Update comment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Check ownership or admin
        if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this comment"
            });
        }

        // Delete all replies first
        await Comment.deleteMany({ parentComment: comment._id });

        // Remove from post's comments array
        await Post.findByIdAndUpdate(
            comment.postId,
            { $pull: { comments: comment._id } }
        );

        // Remove from parent's replies array if it's a reply
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(
                comment.parentComment,
                { $pull: { replies: comment._id } }
            );
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("Delete comment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// @desc    Toggle like comment
// @route   POST /api/comments/:id/like
// @access  Private
const toggleLikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const isLiked = comment.likes.includes(req.user.id);

        if (isLiked) {
            comment.likes.pull(req.user.id);
        } else {
            comment.likes.push(req.user.id);
        }

        await comment.save();

        res.status(200).json({
            success: true,
            message: isLiked ? "Comment unliked" : "Comment liked",
            isLiked: !isLiked,
            likesCount: comment.likes.length
        });
    } catch (error) {
        console.error("Toggle like comment error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    toggleLikeComment
};