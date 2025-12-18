import { Box, Typography, Grid } from '@mui/material';
import { Target } from 'lucide-react';

const CurrentBowlerStats = ({ bowler }) => {
  // Ensure we always have data to display
  const displayBowler = bowler || {
    name: 'Current Bowler',
    overs: 0,
    maidens: 0,
    runs: 0,
    wickets: 0
  };

  const calculateEconomy = (runs, overs) => {
    if (!overs || overs === 0) return '0.00';
    // Handle overs in X.Y format (e.g., 4.2 means 4 overs and 2 balls)
    const oversFloat = parseFloat(overs);
    const fullOvers = Math.floor(oversFloat);
    const balls = Math.round((oversFloat - fullOvers) * 10);
    const totalBalls = (fullOvers * 6) + balls;
    if (totalBalls === 0) return '0.00';
    return ((runs / totalBalls) * 6).toFixed(2);
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
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          bgcolor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Target size={18} style={{ color: 'white' }} />
        </Box>
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
          Current Bowler
        </Typography>
      </Box>

      {/* Bowler Stats */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          p: 2.5,
          borderRadius: '12px',
          bgcolor: '#faf5ff',
          border: '1px solid #e9d5ff'
        }}>
          {/* Bowler Name */}
          <Typography sx={{ 
            fontWeight: 700, 
            color: '#0f172a', 
            fontSize: '1rem',
            mb: 2,
            textAlign: 'center'
          }}>
            {displayBowler.name}
          </Typography>

          {/* Stats Grid */}
          <Grid container spacing={1.5}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 1.5,
                bgcolor: 'white',
                borderRadius: '10px',
                border: '1px solid #e9d5ff'
              }}>
                <Typography sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: '#7c3aed',
                  lineHeight: 1
                }}>
                  {displayBowler.overs || 0}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: '#64748b',
                  fontWeight: 600,
                  mt: 0.5,
                  textTransform: 'uppercase'
                }}>
                  Overs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 1.5,
                bgcolor: 'white',
                borderRadius: '10px',
                border: '1px solid #e9d5ff'
              }}>
                <Typography sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: '#0f172a',
                  lineHeight: 1
                }}>
                  {displayBowler.maidens || 0}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: '#64748b',
                  fontWeight: 600,
                  mt: 0.5,
                  textTransform: 'uppercase'
                }}>
                  Maidens
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 1.5,
                bgcolor: 'white',
                borderRadius: '10px',
                border: '1px solid #e9d5ff'
              }}>
                <Typography sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: '#ef4444',
                  lineHeight: 1
                }}>
                  {displayBowler.runs || 0}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: '#64748b',
                  fontWeight: 600,
                  mt: 0.5,
                  textTransform: 'uppercase'
                }}>
                  Runs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ 
                textAlign: 'center',
                p: 1.5,
                bgcolor: 'white',
                borderRadius: '10px',
                border: '1px solid #e9d5ff'
              }}>
                <Typography sx={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 800, 
                  color: '#22c55e',
                  lineHeight: 1
                }}>
                  {displayBowler.wickets || 0}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: '#64748b',
                  fontWeight: 600,
                  mt: 0.5,
                  textTransform: 'uppercase'
                }}>
                  Wickets
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Economy Rate */}
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '1px solid #e9d5ff',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
              px: 3,
              py: 1,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)'
              }}>
                Economy:
              </Typography>
              <Typography sx={{ 
                fontSize: '1rem', 
                fontWeight: 800,
                color: 'white'
              }}>
                {calculateEconomy(displayBowler.runs || 0, displayBowler.overs || 0)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CurrentBowlerStats;
