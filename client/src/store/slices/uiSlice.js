import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: false,
  notifications: [],
  loading: {
    global: false,
    posts: false,
    auth: false,
  },
  modals: {
    login: false,
    signup: false,
    deleteConfirm: false,
  },
  toast: {
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setPostsLoading: (state, action) => {
      state.loading.posts = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.loading.auth = action.payload;
    },
    openModal: (state, action) => {
      const { modal } = action.payload;
      state.modals[modal] = true;
    },
    closeModal: (state, action) => {
      const { modal } = action.payload;
      state.modals[modal] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    showToast: (state, action) => {
      const { message, severity = 'info' } = action.payload;
      state.toast = {
        open: true,
        message,
        severity,
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  setPostsLoading,
  setAuthLoading,
  openModal,
  closeModal,
  closeAllModals,
  showToast,
  hideToast,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;