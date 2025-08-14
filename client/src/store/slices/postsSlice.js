import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsAPI } from '../../utils/api';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getAllPosts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);

export const fetchFeaturedPosts = createAsyncThunk(
  'posts/fetchFeaturedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getFeaturedPosts();
      return response.posts;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch featured posts');
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'posts/fetchPostBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getPostBySlug(slug);
      return response.post;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postsAPI.createPost(formData);
      return response.post;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await postsAPI.updatePost(id, formData);
      return response.post;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await postsAPI.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete post');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'posts/toggleLike',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postsAPI.toggleLike(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle like');
    }
  }
);

export const toggleBookmark = createAsyncThunk(
  'posts/toggleBookmark',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postsAPI.toggleBookmark(id);
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle bookmark');
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  'posts/fetchMyPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getMyPosts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch my posts');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'posts/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getCategories();
      return response.categories;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchTags = createAsyncThunk(
  'posts/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsAPI.getTags();
      return response.tags;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tags');
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  featuredPosts: [],
  currentPost: null,
  myPosts: [],
  categories: [],
  tags: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
  filters: {
    category: '',
    tags: '',
    search: '',
    sort: 'latest',
  },
};

// Posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        tags: '',
        search: '',
        sort: 'latest',
      };
    },
    updatePostInList: (state, action) => {
      const { id, updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post._id === id);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Featured Posts
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.featuredPosts = action.payload;
      })
      // Fetch Post by Slug
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
        state.myPosts = state.myPosts.filter(post => post._id !== action.payload);
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, isLiked, likesCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === id);
        if (postIndex !== -1) {
          state.posts[postIndex].likes = isLiked 
            ? [...state.posts[postIndex].likes, 'current-user']
            : state.posts[postIndex].likes.filter(like => like !== 'current-user');
        }
        if (state.currentPost && state.currentPost._id === id) {
          state.currentPost.likes = isLiked 
            ? [...state.currentPost.likes, 'current-user']
            : state.currentPost.likes.filter(like => like !== 'current-user');
        }
      })
      // Fetch My Posts
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload.posts;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Tags
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearCurrentPost, 
  setFilters, 
  clearFilters, 
  updatePostInList 
} = postsSlice.actions;

export default postsSlice.reducer;