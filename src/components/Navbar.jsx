import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Chip, Divider } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';

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
      elevation={1}
      sx={{
        background: '#1976d2',
        borderBottom: '1px solid #1565c0',
      }}
    >
      <Toolbar sx={{ py: 1, px: { xs: 2, md: 3 } }}>
        {/* Logo Section */}
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            color: 'inherit',
            mr: 3
          }}
        >
          <SportsCricketIcon sx={{ fontSize: 28, mr: 1, color: 'white' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: 'white',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Cricket Scoreboard
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexGrow: 1 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              color: 'white',
              fontWeight: isActive('/') ? 600 : 400,
              textTransform: 'none',
              px: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
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
              fontWeight: isActive('/live') ? 600 : 400,
              textTransform: 'none',
              px: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
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
                fontWeight: isActive('/admin') ? 600 : 400,
                textTransform: 'none',
                px: 2,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Admin
            </Button>
          )}
        </Box>

        {/* Auth Section */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: '#1565c0',
                    fontSize: '0.875rem',
                    fontWeight: 600
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
                  elevation: 4,
                  sx: {
                    mt: 1,
                    minWidth: 200,
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
                        background: '#1976d2',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {user?.username || 'User'}
                      </Typography>
                      {isAdmin && (
                        <Chip 
                          label="Admin" 
                          size="small" 
                          color="primary"
                          sx={{ 
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.65rem',
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
                    '&:hover': {
                      background: 'rgba(244, 67, 54, 0.08)',
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>Logout</Typography>
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
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
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
                  color: '#1976d2',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: '#f5f5f5',
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
