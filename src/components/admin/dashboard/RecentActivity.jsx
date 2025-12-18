import { Box, Typography, Button } from '@mui/material';
import { Radio, ArrowRight, TrendingUp } from 'lucide-react';

const RecentActivity = ({ navigate, liveMatches }) => {
  const match = liveMatches[0];

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
        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          bgcolor: 'rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingUp size={20} style={{ color: 'white' }} />
        </Box>
        <Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
            Recent Activity
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
            Live match updates
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5 }}>
        {match ? (
          <>
            {/* Live Match Card */}
            <Box sx={{ 
              mb: 2,
              borderRadius: '14px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
              overflow: 'hidden'
            }}>
              {/* Match Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    bgcolor: '#ef4444',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    <Box sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.4 }
                      }
                    }} />
                    LIVE
                  </Box>
                  <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                    Match #{match.id}
                  </Typography>
                </Box>
                
                <Typography sx={{ 
                  color: '#1e293b', 
                  fontWeight: 700, 
                  fontSize: '0.95rem' 
                }}>
                  {match.team1?.name || 'Team 1'}
                  <Box component="span" sx={{ color: '#94a3b8', fontWeight: 400, mx: 1 }}>vs</Box>
                  {match.team2?.name || 'Team 2'}
                </Typography>
              </Box>

              {/* Score Display */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'white'
              }}>
                <Box>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 500, mb: 0.5 }}>
                    Score
                  </Typography>
                  <Typography sx={{ 
                    color: '#1e293b', 
                    fontSize: '1.25rem', 
                    fontWeight: 800 
                  }}>
                    {match.innings?.[0]?.totalRuns || 0}
                    <Box component="span" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                      /{match.innings?.[0]?.totalWickets || 0}
                    </Box>
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 500, mb: 0.5 }}>
                    Overs
                  </Typography>
                  <Typography sx={{ 
                    color: '#1e293b', 
                    fontSize: '1.25rem', 
                    fontWeight: 800 
                  }}>
                    {match.innings?.[0]?.totalOvers || '0.0'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Update Score Button */}
            <Button
              fullWidth
              onClick={() => navigate(`/admin/score-entry/${match.id}`)}
              sx={{
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                color: 'white',
                py: 1.5,
                px: 2.5,
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(124, 58, 237, 0.35)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Radio size={18} />
                <span>Update Score</span>
              </Box>
              <ArrowRight size={18} />
            </Button>
          </>
        ) : (
          /* Empty State */
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ 
              mx: 'auto',
              mb: 2,
              width: 64,
              height: 64,
              borderRadius: '16px',
              bgcolor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Radio size={28} style={{ color: '#94a3b8' }} />
            </Box>
            <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
              No live matches
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Start a match to see live activity here
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RecentActivity;
