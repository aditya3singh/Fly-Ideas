import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (formData) => api.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Posts API calls
export const postsAPI = {
  getAllPosts: (params) => api.get('/posts', { params }),
  getFeaturedPosts: () => api.get('/posts/featured'),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),
  createPost: (formData) => api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updatePost: (id, formData) => api.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePost: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
  toggleBookmark: (id) => api.post(`/posts/${id}/bookmark`),
  getMyPosts: (params) => api.get('/posts/my/posts', { params }),
  getPostsByUser: (username, params) => api.get(`/posts/user/${username}`, { params }),
  getCategories: () => api.get('/posts/categories'),
  getTags: () => api.get('/posts/tags'),
};

// Comments API calls
export const commentsAPI = {
  getComments: (postId, params) => api.get(`/comments/posts/${postId}/comments`, { params }),
  createComment: (postId, commentData) => api.post(`/comments/posts/${postId}/comments`, commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  toggleLikeComment: (id) => api.post(`/comments/${id}/like`),
};

// Users API calls
export const usersAPI = {
  getUserByUsername: (username) => api.get(`/users/${username}`),
  toggleFollow: (userId) => api.post(`/users/${userId}/follow`),
};

export default api;