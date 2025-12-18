import { Box, Typography, Button } from '@mui/material';
import { Radio, ArrowRight, Sparkles, Trophy, Users, User } from 'lucide-react';

const DashboardActions = ({ navigate, liveMatches }) => {
  return (
    <Box sx={{ 
      bgcolor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2.5,
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          bgcolor: 'rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={20} style={{ color: '#60a5fa' }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
            Quick Actions
          </Typography>
          <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.75rem' }}>
            Manage matches, teams & players
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Primary Action */}
        <Button
          fullWidth
          onClick={() => navigate('/admin/matches')}
          sx={{
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            py: 1.5,
            px: 2.5,
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.35)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Trophy size={18} />
            <span>Manage Matches</span>
          </Box>
          <ArrowRight size={18} />
        </Button>

        {/* Live Score Entry */}
        <Button
          fullWidth
          disabled={!liveMatches.length}
          onClick={() => navigate(`/admin/score-entry/${liveMatches[0]?.id}`)}
          sx={{
            justifyContent: 'space-between',
            background: liveMatches.length 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : '#f1f5f9',
            color: liveMatches.length ? 'white' : '#94a3b8',
            py: 1.5,
            px: 2.5,
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
            textTransform: 'none',
            boxShadow: liveMatches.length ? '0 4px 12px rgba(239, 68, 68, 0.25)' : 'none',
            '&:hover': {
              background: liveMatches.length 
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : '#f1f5f9',
              transform: liveMatches.length ? 'translateY(-1px)' : 'none',
            },
            '&.Mui-disabled': {
              background: '#f1f5f9',
              color: '#94a3b8'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Radio size={18} style={{ animation: liveMatches.length ? 'pulse 2s infinite' : 'none' }} />
            <span>Live Score Entry</span>
          </Box>
          <ArrowRight size={18} />
        </Button>

        {/* Secondary Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 0.5 }}>
          <Button
            fullWidth
            onClick={() => navigate('/admin/teams')}
            sx={{
              bgcolor: 'rgba(34, 197, 94, 0.1)',
              color: '#16a34a',
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(34, 197, 94, 0.15)',
                borderColor: 'rgba(34, 197, 94, 0.3)'
              }
            }}
          >
            <Users size={16} style={{ marginRight: 6 }} />
            Teams
          </Button>
          <Button
            fullWidth
            onClick={() => navigate('/admin/players')}
            sx={{
              bgcolor: 'rgba(245, 158, 11, 0.1)',
              color: '#d97706',
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(245, 158, 11, 0.15)',
                borderColor: 'rgba(245, 158, 11, 0.3)'
              }
            }}
          >
            <User size={16} style={{ marginRight: 6 }} />
            Players
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardActions;
