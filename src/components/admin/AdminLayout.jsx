import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { BarChart3, Trophy, Users, User } from 'lucide-react';

const adminNavItems = [
  { label: 'Overview', path: '/admin', icon: BarChart3 },
  { label: 'Matches', path: '/admin/matches', icon: Trophy },
  { label: 'Teams', path: '/admin/teams', icon: Users },
  { label: 'Players', path: '/admin/players', icon: User },
];

const AdminLayout = ({ title, subtitle, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer exact path match; fall back to prefix match for nested routes
  let currentTab = adminNavItems.findIndex(item => location.pathname === item.path);
  if (currentTab === -1) {
    currentTab = adminNavItems.findIndex(item => location.pathname.startsWith(item.path));
  }

  const handleTabClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      pb: 4
    }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.3) 0%, transparent 40%)`,
          pointerEvents: 'none'
        }} />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Title Section */}
          <Box sx={{ pt: 4, pb: 3 }}>
            <Typography sx={{ 
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
              mb: 0.5
            }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography sx={{ 
                color: 'rgba(148, 163, 184, 0.9)',
                fontSize: '0.95rem',
                fontWeight: 400
              }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Navigation Tabs */}
          <Box sx={{ 
            display: 'flex',
            gap: 0.5,
            pb: 0,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            {adminNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentTab === index;
              
              return (
                <Box
                  key={item.path}
                  onClick={() => handleTabClick(item.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                    cursor: 'pointer',
                    borderBottom: '3px solid',
                    borderColor: isActive ? '#3b82f6' : 'transparent',
                    bgcolor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(59, 130, 246, 0.08)',
                    }
                  }}
                >
                  <Icon 
                    size={18} 
                    style={{ 
                      color: isActive ? '#60a5fa' : 'rgba(148, 163, 184, 0.7)',
                      transition: 'color 0.2s'
                    }} 
                  />
                  <Typography sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'white' : 'rgba(148, 163, 184, 0.9)',
                    display: { xs: 'none', sm: 'block' }
                  }}>
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* Content Area */}
      <Container maxWidth="xl" sx={{ mt: 3, overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
        {children}
      </Container>
    </Box>
  );
};

export default AdminLayout;
