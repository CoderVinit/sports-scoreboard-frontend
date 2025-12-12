import { Container, Grid, Paper, Typography, Box, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsScore from '@mui/icons-material/SportsScore';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const adminCards = [
    {
      title: 'Manage Matches',
      description: 'Create, edit, and manage cricket matches',
      icon: <SportsScore sx={{ fontSize: 60 }} />,
      link: '/admin/matches',
      color: '#1976d2'
    },
    {
      title: 'Score Entry',
      description: 'Update live scores and match statistics',
      icon: <SportsCricketIcon sx={{ fontSize: 60 }} />,
      link: '/admin/matches',
      color: '#2e7d32'
    },
    {
      title: 'Manage Teams',
      description: 'Add and manage cricket teams',
      icon: <GroupsIcon sx={{ fontSize: 60 }} />,
      link: '/admin/teams',
      color: '#ed6c02'
    },
    {
      title: 'Manage Players',
      description: 'Add and manage player profiles',
      icon: <PersonIcon sx={{ fontSize: 60 }} />,
      link: '/admin/players',
      color: '#9c27b0'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 50, mr: 2 }} />
          <Box>
            <Typography variant="h3" component="h1">
              Admin Dashboard
            </Typography>
            <Typography variant="h6">
              Welcome, {user?.username}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Manage matches, teams, players, and update live scores
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {adminCards.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ color: card.color, mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button 
                  component={Link} 
                  to={card.link}
                  variant="contained" 
                  size="large"
                  sx={{ bgcolor: card.color, '&:hover': { bgcolor: card.color, opacity: 0.9 } }}
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
