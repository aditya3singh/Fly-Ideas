import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

// Store
import store from './store/store';
import { getProfile } from './store/slices/authSlice';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import Toast from './components/common/Toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostDetails from './pages/PostDetails';
import WritePost from './pages/WritePost';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// App Content Component
const AppContent = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Create theme based on user preference
  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#4F46E5',
        light: '#6366F1',
        dark: '#3730A3',
      },
      secondary: {
        main: '#EC4899',
        light: '#F472B6',
        dark: '#BE185D',
      },
      background: {
        default: theme === 'dark' ? '#0F172A' : '#FFFFFF',
        paper: theme === 'dark' ? '#1E293B' : '#FFFFFF',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: theme === 'dark' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  // Load user profile on app start if authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated, loading]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <HelmetProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <Box component="main" sx={{ flexGrow: 1, pt: { xs: 8, sm: 9 } }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post/:slug" element={<PostDetails />} />
              <Route path="/profile/:username" element={<Profile />} />
              
              {/* Auth Routes (redirect if authenticated) */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/write" element={
                <ProtectedRoute>
                  <WritePost />
                </ProtectedRoute>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <WritePost />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
          
          <Footer />
          <LoadingSpinner />
          <Toast />
        </Box>
      </HelmetProvider>
    </ThemeProvider>
  );
};

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
