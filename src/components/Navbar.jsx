import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Chip, Divider } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';
import { keyframes } from '@mui/system';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1, px: { xs: 2, md: 4 } }}>
        {/* Logo Section */}
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: 'inherit',
            mr: 4,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              mr: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'rotate(360deg)',
              }
            }}
          >
            <SportsCricketIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Cricket Scoreboard
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexGrow: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              color: 'white',
              fontWeight: isActive('/') ? 700 : 500,
              textTransform: 'none',
              px: 2,
              py: 1,
              borderRadius: 2,
              background: isActive('/') 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Home
          </Button>
          
          <Button
            component={Link}
            to="/live"
            startIcon={<LiveTvIcon />}
            sx={{
              color: 'white',
              fontWeight: isActive('/live') ? 700 : 500,
              textTransform: 'none',
              px: 2,
              py: 1,
              borderRadius: 2,
              background: isActive('/live') 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Live Matches
          </Button>
          
          {isAdmin && (
            <Button
              component={Link}
              to="/admin"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{
                color: 'white',
                fontWeight: isActive('/admin') ? 700 : 500,
                textTransform: 'none',
                px: 2,
                py: 1,
                borderRadius: 2,
                background: isActive('/admin') 
                  ? 'rgba(255, 255, 255, 0.25)' 
                  : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Admin
            </Button>
          )}
        </Box>

        {/* Auth Section */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                    fontSize: '0.875rem',
                    fontWeight: 700
                  }}
                >
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    background: 'white',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '1rem',
                        fontWeight: 700
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="text.primary">
                        {user?.username || 'User'}
                      </Typography>
                      {isAdmin && (
                        <Chip 
                          label="Admin" 
                          size="small" 
                          sx={{ 
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.65rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600
                          }} 
                        />
                      )}
                    </Box>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    color: 'error.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.08)',
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
                variant="contained"
                sx={{
                  background: 'white',
                  color: '#667eea',
                  textTransform: 'none',
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
