import { Box, Typography, Grid } from '@mui/material';
import { User } from 'lucide-react';

const CurrentBatsmenStats = ({ batsmen = [] }) => {
  // Ensure we always have data to display
  const displayBatsmen = batsmen.length > 0 ? batsmen : [
    { name: 'Batsman 1', runs: 0, balls: 0, fours: 0, sixes: 0 },
    { name: 'Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0 }
  ];

  const calculateStrikeRate = (runs, balls) => {
    if (balls === 0) return '0.00';
    return ((runs / balls) * 100).toFixed(2);
  };

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
        p: 2,
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          bgcolor: 'rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User size={18} style={{ color: '#60a5fa' }} />
        </Box>
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
          Current Batsmen
        </Typography>
      </Box>

      {/* Batsmen List */}
      <Box sx={{ p: 2 }}>
        {displayBatsmen.map((batsman, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: index === 0 ? '#f0f9ff' : '#f8fafc',
              border: '1px solid',
              borderColor: index === 0 ? '#bae6fd' : '#e2e8f0',
              mb: index === 0 ? 1.5 : 0,
              position: 'relative'
            }}
          >
            {/* Striker Indicator */}
            {index === 0 && (
              <Box sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: '#22c55e',
                color: 'white',
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                fontSize: '0.65rem',
                fontWeight: 700
              }}>
                STRIKER
              </Box>
            )}

            {/* Batsman Name */}
            <Typography sx={{ 
              fontWeight: 700, 
              color: '#0f172a', 
              fontSize: '0.9rem',
              mb: 1.5
            }}>
              {batsman.name || `Batsman ${index + 1}`}
            </Typography>

            {/* Stats Grid */}
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: '#0f172a',
                    lineHeight: 1
                  }}>
                    {batsman.runs || 0}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.65rem', 
                    color: '#64748b',
                    fontWeight: 500,
                    mt: 0.25
                  }}>
                    RUNS
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: '#475569',
                    lineHeight: 1
                  }}>
                    {batsman.balls || 0}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.65rem', 
                    color: '#64748b',
                    fontWeight: 500,
                    mt: 0.25
                  }}>
                    BALLS
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: '#3b82f6',
                    lineHeight: 1
                  }}>
                    {batsman.fours || 0}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.65rem', 
                    color: '#64748b',
                    fontWeight: 500,
                    mt: 0.25
                  }}>
                    4s
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 800, 
                    color: '#22c55e',
                    lineHeight: 1
                  }}>
                    {batsman.sixes || 0}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.65rem', 
                    color: '#64748b',
                    fontWeight: 500,
                    mt: 0.25
                  }}>
                    6s
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Strike Rate */}
            <Box sx={{ 
              mt: 1.5, 
              pt: 1.5, 
              borderTop: '1px solid',
              borderColor: index === 0 ? '#bae6fd' : '#e2e8f0',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Box sx={{
                bgcolor: index === 0 ? '#e0f2fe' : '#f1f5f9',
                px: 2,
                py: 0.5,
                borderRadius: '8px'
              }}>
                <Typography sx={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  SR: <span style={{ color: '#0f172a', fontWeight: 700 }}>
                    {calculateStrikeRate(batsman.runs || 0, batsman.balls || 0)}
                  </span>
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CurrentBatsmenStats;
