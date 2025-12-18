import { Box, Container, Typography, Grid, IconButton, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useThemeMode } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useThemeMode();

  const footerLinks = {
    product: [
      { label: 'Live Scores', path: '/live' },
      { label: 'Matches', path: '/matches' },
      { label: 'Teams', path: '/teams' },
      { label: 'Players', path: '/players' },
    ],
    resources: [
      { label: 'API Docs', path: '#' },
      { label: 'Statistics', path: '#' },
      { label: 'News', path: '#' },
    ],
    company: [
      { label: 'About Us', path: '#' },
      { label: 'Contact', path: '#' },
      { label: 'Privacy Policy', path: '#' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: isDark ? 'background.paper' : '#0f172a',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SportsCricketIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" fontWeight={800}>
                CricScore
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 300 }}>
              Your ultimate destination for live cricket scores, match updates, and comprehensive statistics.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                <GitHubIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.product.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.resources.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.company.map((link) => (
                <MuiLink
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} CricScore. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Made with ❤️ for cricket fans
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
