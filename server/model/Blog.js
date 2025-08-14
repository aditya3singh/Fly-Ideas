const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    excerpt: {
        type: String,
        maxlength: [300, "Excerpt cannot exceed 300 characters"]
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
        lowercase: true
    },
    thumbnail: {
        type: String,
        default: ""
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }],
    views: {
        type: Number,
        default: 0
    },
    readTime: {
        type: Number, // in minutes
        default: 1
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    },
    featured: {
        type: Boolean,
        default: false
    },
    seoTitle: String,
    seoDescription: String,
    publishedAt: Date
}, {
    timestamps: true
});

// Generate slug before saving
postSchema.pre("save", function(next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true });
        
        // Generate excerpt if not provided
        if (!this.excerpt && this.content) {
            this.excerpt = this.content.replace(/<[^>]*>/g, "").substring(0, 200) + "...";
        }
        
        // Calculate read time (average 200 words per minute)
        if (this.content) {
            const wordCount = this.content.split(/\s+/).length;
            this.readTime = Math.ceil(wordCount / 200);
        }
        
        // Set published date if status is published
        if (this.status === "published" && !this.publishedAt) {
            this.publishedAt = new Date();
        }
    }
    next();
});

// Indexes for better performance
postSchema.index({ slug: 1 });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ category: 1, status: 1 });
postSchema.index({ tags: 1, status: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likes: 1 });

module.exports = mongoose.model("Post", postSchema);