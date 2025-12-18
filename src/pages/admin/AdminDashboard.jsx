import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import AdminLayout from '../../components/admin/AdminLayout';
import CricketLoader from '../../components/CricketLoader';
import { matchService, teamService, playerService } from '../../api/services';

import DashboardStats from '../../components/admin/dashboard/DashboardStats';
import DashboardActions from '../../components/admin/dashboard/DashboardActions';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';

const AdminDashboardStatic = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

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
        const [matches, live, teams, players] = await Promise.all([
          matchService.getAllMatches(),
          matchService.getLiveMatches(),
          teamService.getAllTeams(),
          playerService.getAllPlayers()
        ]);

        setStats({
          totalMatches: matches.data?.length || matches.matches?.length || 0,
          liveMatches: live.data?.length || live.matches?.length || 0,
          totalTeams: teams.data?.length || teams.teams?.length || 0,
          totalPlayers: players.data?.length || players.players?.length || 0
        });

        setLiveMatches(live.data || live.matches || []);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle={`Welcome, ${user?.username || ''}`}>
        <CricketLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle={`Welcome back, ${user?.username || 'Admin'}. Here's your overview.`}
    >
      <DashboardStats stats={stats} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardActions navigate={navigate} liveMatches={liveMatches} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity navigate={navigate} liveMatches={liveMatches} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboardStatic;
