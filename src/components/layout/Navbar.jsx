import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Container,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useThemeMode } from '../../context/ThemeContext';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Live Matches', path: '/live', icon: <LiveTvIcon /> },
  { label: 'Matches', path: '/matches', icon: <EmojiEventsIcon /> },
  { label: 'Teams', path: '/teams', icon: <GroupsIcon /> },
  { label: 'Players', path: '/players', icon: <PersonIcon /> },
];

const Navbar = () => {
  const theme = useTheme();
  const { mode, toggleTheme, isDark } = useThemeMode();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            width: 36,
            height: 36,
          }}>
            <SportsCricketIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Typography variant="h6" fontWeight={800} color="primary.main">
            CricScore
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton
            component={Link}
            to="/admin"
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              bgcolor: isActive('/admin') ? 'secondary.main' : 'transparent',
              color: isActive('/admin') ? 'secondary.contrastText' : 'text.primary',
              '&:hover': {
                bgcolor: isActive('/admin') ? 'secondary.dark' : 'action.hover',
              },
            }}
          >
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <AdminPanelSettingsIcon />
            </Box>
            <ListItemText primary="Admin Panel" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={isDark ? <LightModeIcon /> : <DarkModeIcon />}
          onClick={toggleTheme}
          sx={{ borderRadius: 2 }}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: isDark ? 'rgba(15, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                mr: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}>
                <SportsCricketIcon sx={{ fontSize: 22 }} />
              </Avatar>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                CricScore
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, ml: 6 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      px: 2,
                      borderRadius: 2,
                      position: 'relative',
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: 3,
                        bgcolor: 'primary.main',
                        borderRadius: 2,
                      } : {},
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Actions */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                  <IconButton 
                    onClick={toggleTheme}
                    sx={{ 
                      bgcolor: 'action.hover',
                      '&:hover': { bgcolor: 'action.selected' }
                    }}
                  >
                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>

                <Button
                  component={Link}
                  to="/admin"
                  variant="contained"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{
                    ml: 1,
                    background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #db2777 0%, #e11d48 100%)',
                    }
                  }}
                >
                  Admin
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={toggleTheme}>
                  {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
