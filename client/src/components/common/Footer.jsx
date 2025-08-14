import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Favorite,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { name: 'Home', href: '/' },
      { name: 'Write', href: '/write' },
      { name: 'Search', href: '/search' },
      { name: 'Categories', href: '/categories' },
    ],
    Community: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Help Center', href: '/help' },
      { name: 'Contact', href: '/contact' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Guidelines', href: '/guidelines' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', icon: <GitHub />, href: 'https://github.com' },
    { name: 'Twitter', icon: <Twitter />, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <LinkedIn />, href: 'https://linkedin.com' },
    { name: 'Email', icon: <Email />, href: 'mailto:hello@flythoughts.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4F46E5, #EC4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Fly Thoughts
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 300 }}
            >
              A modern blogging platform where ideas take flight. Share your thoughts, 
              connect with readers, and build your community.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={6} sm={4} md={2.67} key={category}>
              <Typography
                variant="subtitle2"
                color="text.primary"
                fontWeight="medium"
                sx={{ mb: 2 }}
              >
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    color="text.secondary"
                    variant="body2"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Fly Thoughts. All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              Made with
            </Typography>
            <Favorite sx={{ fontSize: 16, color: 'error.main' }} />
            <Typography variant="body2">
              by the Fly Thoughts team
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;