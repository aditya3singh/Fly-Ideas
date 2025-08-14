import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  LightMode,
  DarkMode,
  Home,
  Create,
  Dashboard,
  Person,
  Logout,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme: currentTheme, sidebarOpen } = useSelector((state) => state.ui);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/', auth: false },
    { text: 'Write', icon: <Create />, path: '/write', auth: true },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', auth: true },
  ];

  const authMenuItems = isAuthenticated ? [
    { text: 'Profile', icon: <Person />, action: () => navigate(`/profile/${user?.username}`) },
    { text: 'Dashboard', icon: <Dashboard />, action: () => navigate('/dashboard') },
    { text: 'Logout', icon: <Logout />, action: handleLogout },
  ] : [
    { text: 'Login', icon: <Login />, action: () => navigate('/login') },
    { text: 'Sign Up', icon: <PersonAdd />, action: () => navigate('/signup') },
  ];

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={1}
        sx={{ 
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fly Thoughts
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {menuItems.map((item) => (
                (!item.auth || isAuthenticated) && (
                  <Button
                    key={item.text}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                )
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/search')}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              aria-label="toggle theme"
            >
              {currentTheme === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>

            {isAuthenticated ? (
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                aria-label="account menu"
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.username}
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            ) : (
              !isMobile && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/signup"
                    sx={{ ml: 1 }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated && (
          <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {user?.username}
            </Typography>
          </Box>
        )}
        {authMenuItems.map((item, index) => (
          <MenuItem key={item.text} onClick={item.action}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText>{item.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={handleSidebarToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Fly Thoughts
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            (!item.auth || isAuthenticated) && (
              <ListItem
                key={item.text}
                button
                component={Link}
                to={item.path}
                onClick={handleSidebarToggle}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            )
          ))}
        </List>
        {!isAuthenticated && (
          <>
            <Divider />
            <List>
              <ListItem button component={Link} to="/login" onClick={handleSidebarToggle}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component={Link} to="/signup" onClick={handleSidebarToggle}>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
    </>
  );
};

export default Navbar;