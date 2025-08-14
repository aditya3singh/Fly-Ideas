import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';

const LoadingSpinner = () => {
  const { loading } = useSelector((state) => state.ui);
  const isLoading = loading.global || loading.posts || loading.auth;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={isLoading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
          }}
        />
        <Typography variant="body1" color="inherit">
          Loading...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingSpinner;