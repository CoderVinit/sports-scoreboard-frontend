import { Container, Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const adminNavItems = [
  { label: 'Overview', path: '/admin' },
  { label: 'Matches', path: '/admin/matches' },
  { label: 'Teams', path: '/admin/teams' },
  { label: 'Players', path: '/admin/players' },
];

const AdminLayout = ({ title, subtitle, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer exact path match; fall back to prefix match for nested routes
  let currentTab = adminNavItems.findIndex(item => location.pathname === item.path);
  if (currentTab === -1) {
    currentTab = adminNavItems.findIndex(item => location.pathname.startsWith(item.path));
  }

  const handleChange = (_event, newValue) => {
    const item = adminNavItems[newValue];
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={currentTab === -1 ? 0 : currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {adminNavItems.map((item) => (
            <Tab key={item.path} label={item.label} />
          ))}
        </Tabs>
      </Paper>

      {children}
    </Container>
  );
};

export default AdminLayout;
