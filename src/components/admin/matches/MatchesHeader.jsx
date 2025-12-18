import { Box, Typography, Button } from '@mui/material';
import { Plus, Trophy } from 'lucide-react';

const MatchesHeader = ({ total, onCreate }) => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '16px',
      p: 3,
      mb: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.25)'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />
      
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy size={24} style={{ color: 'white' }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
            Manage Matches
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
            {total} matches total
          </Typography>
        </Box>
      </Box>
      
      <Button
        onClick={onCreate}
        startIcon={<Plus size={18} />}
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'white',
          color: '#1d4ed8',
          px: 3,
          py: 1.25,
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.9rem',
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            bgcolor: '#f8fafc',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        Create Match
      </Button>
    </Box>
  );
};

export default MatchesHeader;
