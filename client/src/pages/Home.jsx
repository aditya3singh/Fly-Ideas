import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Skeleton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPosts, fetchFeaturedPosts } from '../store/slices/postsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, featuredPosts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts({ limit: 6 }));
    dispatch(fetchFeaturedPosts());
  }, [dispatch]);

  const handlePostClick = (slug) => {
    navigate(`/post/${slug}`);
  };

  const PostCard = ({ post, featured = false }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
      onClick={() => handlePostClick(post.slug)}
    >
      {post.thumbnail && (
        <CardMedia
          component="img"
          height={featured ? 200 : 160}
          image={post.thumbnail}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={post.author?.avatar}
            alt={post.author?.username}
            sx={{ width: 32, height: 32, mr: 1 }}
          >
            {post.author?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {post.author?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        
        <Typography
          variant={featured ? 'h5' : 'h6'}
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.title}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {post.excerpt}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {post.tags?.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {post.readTime} min read
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.likes?.length || 0} likes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const PostSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={160} />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={100} />
        </Box>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={60} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Fly Thoughts - Modern Blogging Platform</title>
        <meta
          name="description"
          content="Discover amazing stories, insights, and ideas from writers around the world. Join Fly Thoughts and share your thoughts with the community."
        />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Where Ideas Take Flight
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Discover amazing stories, share your thoughts, and connect with a community of passionate writers and readers.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/write')}
              sx={{ px: 4, py: 1.5 }}
            >
              Start Writing
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/search')}
              sx={{ px: 4, py: 1.5 }}
            >
              Explore Posts
            </Button>
          </Box>
        </Box>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
              Featured Posts
            </Typography>
            <Grid container spacing={4}>
              {featuredPosts.slice(0, 3).map((post) => (
                <Grid item xs={12} md={4} key={post._id}>
                  <PostCard post={post} featured />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Recent Posts */}
        <Box>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
            Recent Posts
          </Typography>
          <Grid container spacing={4}>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <PostSkeleton />
                </Grid>
              ))
            ) : (
              posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  <PostCard post={post} />
                </Grid>
              ))
            )}
          </Grid>
          
          {posts.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/search')}
              >
                View All Posts
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;