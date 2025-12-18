import { Box } from '@mui/material';
import { Trophy, Radio, Users, User } from 'lucide-react';
import StatCard from './StatCard';

const DashboardStats = ({ stats }) => {
  const cards = [
    { 
      title: 'Total Matches', 
      value: stats.totalMatches, 
      icon: Trophy, 
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6'
    },
    { 
      title: 'Live Matches', 
      value: stats.liveMatches, 
      icon: Radio, 
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      iconColor: '#ef4444',
      pulse: true 
    },
    { 
      title: 'Total Teams', 
      value: stats.totalTeams, 
      icon: Users, 
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      iconColor: '#22c55e'
    },
    { 
      title: 'Total Players', 
      value: stats.totalPlayers, 
      icon: User, 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      iconColor: '#f59e0b'
    }
  ];

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 2.5,
      mb: 3
    }}>
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </Box>
  );
};

export default DashboardStats;
