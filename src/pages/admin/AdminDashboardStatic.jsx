import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import { matchService, teamService, playerService } from '../../api/services';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboardStatic = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalTeams: 0,
    totalPlayers: 0,
  });
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [matchesData, liveData, teamsData, playersData] = await Promise.all([
          matchService.getAllMatches(),
          matchService.getLiveMatches(),
          teamService.getAllTeams(),
          playerService.getAllPlayers()
        ]);
        
        setStats({
          totalMatches: matchesData.matches?.length || matchesData.data?.length || 0,
          liveMatches: liveData.matches?.length || liveData.data?.length || 0,
          totalTeams: teamsData.teams?.length || teamsData.data?.length || 0,
          totalPlayers: playersData.players?.length || playersData.data?.length || 0,
        });
        setLiveMatches(liveData.matches || liveData.data || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle={`Welcome, ${user?.username || ''}`}> 
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard" subtitle={`Welcome, ${user?.username || ''}`}>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalMatches}
                  </Typography>
                  <Typography variant="body2">
                    Total Matches
                  </Typography>
                </Box>
                <SportsCricketIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.liveMatches}
                  </Typography>
                  <Typography variant="body2">
                    Live Matches
                  </Typography>
                </Box>
                <ScoreboardIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalTeams}
                  </Typography>
                  <Typography variant="body2">
                    Total Teams
                  </Typography>
                </Box>
                <GroupsIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalPlayers}
                  </Typography>
                  <Typography variant="body2">
                    Total Players
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/admin/matches')}
                >
                  Manage Matches
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => navigate(`/admin/score-entry/${liveMatches[0]?.id || 1}`)}
                  disabled={liveMatches.length === 0}
                >
                  Live Score Entry
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/admin/teams')}
                >
                  Manage Teams
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/admin/players')}
                >
                  Manage Players
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {liveMatches.length > 0 ? (
                  <>
                    <Typography variant="body2">
                      • Match #{liveMatches[0].id} is currently live
                    </Typography>
                    <Typography variant="body2">
                      • {liveMatches[0].team1?.name || liveMatches[0].Team1?.name} vs {liveMatches[0].team2?.name || liveMatches[0].Team2?.name}
                    </Typography>
                    <Typography variant="body2">
                      • Score: {liveMatches[0].innings?.[0]?.totalRuns || 0}/{liveMatches[0].innings?.[0]?.totalWickets || 0} ({liveMatches[0].innings?.[0]?.totalOvers || '0.0'} ov)
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No live matches at the moment
                  </Typography>
                )}
                {/* </Typography> */}
                <Button
                  variant="text"
                  onClick={() => navigate(`/admin/score-entry/${liveMatches[0]?.id || 1}`)}
                  disabled={liveMatches.length === 0}
                >
                  Update Score →
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboardStatic;
