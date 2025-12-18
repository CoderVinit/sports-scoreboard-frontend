import { Box, Typography, Button } from '@mui/material';
import { Plus, User } from 'lucide-react';

const PlayersHeader = ({ total, visible, onAdd }) => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      borderRadius: '16px',
      p: 3,
      mb: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.25)'
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
          <User size={24} style={{ color: 'white' }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
            Manage Players
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
            {visible} of {total} players
          </Typography>
        </Box>
      </Box>
      
      <Button
        onClick={onAdd}
        startIcon={<Plus size={18} />}
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'white',
          color: '#d97706',
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
        Add Player
      </Button>
    </Box>
  );
};

export default PlayersHeader;
