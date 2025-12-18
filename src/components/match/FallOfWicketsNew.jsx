import { Box, Typography, Chip } from '@mui/material';

const FallOfWicketsNew = ({ fallOfWickets }) => {
  if (!fallOfWickets || fallOfWickets.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        px: 2.5, 
        py: 1.25,
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{ 
          width: 28, 
          height: 28, 
          borderRadius: '6px',
          bgcolor: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ fontSize: '0.8rem' }}>📉</Typography>
        </Box>
        <Typography sx={{ 
          color: 'white', 
          fontWeight: 700, 
          fontSize: '0.85rem',
          letterSpacing: '0.3px'
        }}>
          Fall of Wickets
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ 
        p: 2.5, 
        bgcolor: 'white',
        borderRadius: '0 0 12px 12px',
        border: '1px solid #e2e8f0',
        borderTop: 0
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5 
        }}>
          {fallOfWickets.map((fow, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 1,
                bgcolor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#fee2e2',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {/* Wicket Number Badge */}
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '6px',
                bgcolor: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontWeight: 700, 
                  fontSize: '0.7rem' 
                }}>
                  {fow.wicketNumber || index + 1}
                </Typography>
              </Box>

              {/* Score */}
              <Typography sx={{ 
                color: '#1e293b', 
                fontWeight: 700, 
                fontSize: '0.85rem' 
              }}>
                {fow.score || fow.runs}
              </Typography>

              {/* Divider */}
              <Box sx={{ width: 1, height: 16, bgcolor: '#fecaca' }} />

              {/* Player & Over */}
              <Box>
                <Typography sx={{ 
                  color: '#64748b', 
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  lineHeight: 1.2
                }}>
                  {fow.playerName || fow.player?.name || 'Player'}
                </Typography>
                <Typography sx={{ 
                  color: '#94a3b8', 
                  fontSize: '0.65rem' 
                }}>
                  {fow.overs || fow.over || '0.0'} ov
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FallOfWicketsNew;
