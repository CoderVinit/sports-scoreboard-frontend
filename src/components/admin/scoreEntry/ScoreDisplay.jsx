import { Box, Typography } from '@mui/material';

const ScoreDisplay = ({ scoreData }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Main Score Card */}
      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 2,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>
            CURRENT SCORE
          </Typography>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography sx={{ 
            color: '#1e293b', 
            fontSize: '3rem', 
            fontWeight: 800,
            lineHeight: 1
          }}>
            {scoreData.runs}
            <Box component="span" sx={{ color: '#64748b', fontWeight: 500, fontSize: '2rem' }}>
              /{scoreData.wickets}
            </Box>
          </Typography>
          <Typography sx={{ 
            color: '#64748b', 
            fontSize: '1rem',
            fontWeight: 500,
            mt: 1
          }}>
            {scoreData.overs} overs
          </Typography>
        </Box>
      </Box>

      {/* Last 5 Balls */}
      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 2,
          background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>
            LAST 5 BALLS
          </Typography>
        </Box>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {scoreData.balls && scoreData.balls.length > 0 ? (
              scoreData.balls.map((ball, index) => {
                const displayText = ball.isWicket 
                  ? (ball.runs === 0 ? 'W' : `${ball.runs}W`) 
                  : ball.runs;
                
                const getBallColor = () => {
                  if (ball.isWicket) return { bg: '#ef4444', color: 'white' };
                  if (ball.runs === 6) return { bg: '#22c55e', color: 'white' };
                  if (ball.runs === 4) return { bg: '#3b82f6', color: 'white' };
                  return { bg: '#f1f5f9', color: '#475569' };
                };
                
                const colors = getBallColor();
                
                return (
                  <Box
                    key={index}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      bgcolor: colors.bg,
                      color: colors.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    {displayText}
                  </Box>
                );
              })
            ) : (
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                No balls recorded yet
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Run Rate */}
      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        p: 2.5
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, mb: 0.5 }}>
              CURRENT RR
            </Typography>
            <Typography sx={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>
              {scoreData.runRate || '0.00'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600, mb: 0.5 }}>
              THIS OVER
            </Typography>
            <Typography sx={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>
              {scoreData.currentOverRuns || 0}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ScoreDisplay;
