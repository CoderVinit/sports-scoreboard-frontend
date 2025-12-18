import { Box, Typography, Chip, Divider } from '@mui/material';

const CommentaryNew = ({ commentary }) => {
  if (!commentary || commentary.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        px: 4
      }}>
        <Box sx={{ 
          width: 64, 
          height: 64, 
          borderRadius: '50%', 
          bgcolor: '#f1f5f9', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mx: 'auto',
          mb: 2
        }}>
          <Typography sx={{ fontSize: '1.5rem' }}>🏏</Typography>
        </Box>
        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
          No commentary available yet
        </Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', mt: 0.5 }}>
          Ball-by-ball updates will appear here
        </Typography>
      </Box>
    );
  }

  // Group commentary by overs
  const groupedByOver = commentary.reduce((acc, ball) => {
    const over = Math.floor(ball.overNumber || ball.over || 0);
    if (!acc[over]) {
      acc[over] = { balls: [], totalRuns: 0 };
    }
    acc[over].balls.push(ball);
    acc[over].totalRuns += (ball.runs || 0) + (ball.extras || 0);
    return acc;
  }, {});

  // Sort overs in descending order (latest first)
  const sortedOvers = Object.keys(groupedByOver).sort((a, b) => b - a);

  const getBallStyle = (ball) => {
    if (ball.isWicket) return { 
      bgcolor: '#dc2626', 
      color: 'white',
      shadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
    };
    if (ball.runs === 6) return { 
      bgcolor: '#22c55e', 
      color: 'white',
      shadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
    };
    if (ball.runs === 4) return { 
      bgcolor: '#3b82f6', 
      color: 'white',
      shadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
    };
    if (ball.isWide || ball.isNoBall || ball.extras > 0) return { 
      bgcolor: '#f59e0b', 
      color: 'white',
      shadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
    };
    return { 
      bgcolor: '#e2e8f0', 
      color: '#475569',
      shadow: 'none'
    };
  };

  const getBallText = (ball) => {
    if (ball.isWicket) return 'W';
    if (ball.runs === 6) return '6';
    if (ball.runs === 4) return '4';
    if (ball.isWide) return 'Wd';
    if (ball.isNoBall) return 'Nb';
    return ball.runs || '•';
  };

  const getCommentaryText = (ball) => {
    if (ball.text) return ball.text;
    if (ball.commentary) return ball.commentary;
    
    const bowler = ball.bowler || ball.bowlerName || 'Bowler';
    const batsman = ball.batsman || ball.batsmanName || 'Batsman';
    
    if (ball.isWicket) {
      return `${bowler} to ${batsman}, OUT! ${ball.wicketType || 'Wicket'}`;
    }
    if (ball.runs === 6) {
      return `${bowler} to ${batsman}, SIX! Magnificent shot!`;
    }
    if (ball.runs === 4) {
      return `${bowler} to ${batsman}, FOUR! Great timing!`;
    }
    if (ball.runs === 0) {
      return `${bowler} to ${batsman}, no run`;
    }
    return `${bowler} to ${batsman}, ${ball.runs} run${ball.runs !== 1 ? 's' : ''}`;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 36, 
            height: 36, 
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: '1rem' }}>📢</Typography>
          </Box>
          <Typography sx={{ 
            color: '#1e293b', 
            fontWeight: 700, 
            fontSize: '1.1rem'
          }}>
            Ball by Ball
          </Typography>
        </Box>
        <Chip 
          label={`${commentary.length} deliveries`}
          size="small"
          sx={{ 
            bgcolor: '#f1f5f9',
            color: '#64748b',
            fontWeight: 500,
            fontSize: '0.75rem'
          }}
        />
      </Box>

      {/* Commentary List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sortedOvers.map((over, overIdx) => (
          <Box key={over}>
            {/* Over Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 2
            }}>
              <Box sx={{ 
                px: 2,
                py: 0.75,
                bgcolor: '#1e293b',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Typography sx={{ 
                  fontWeight: 700, 
                  color: 'white', 
                  fontSize: '0.8rem' 
                }}>
                  Over {parseInt(over) + 1}
                </Typography>
                <Box sx={{ width: 1, height: 12, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>
                  {groupedByOver[over].totalRuns} runs
                </Typography>
              </Box>

              {/* Ball Summary */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {groupedByOver[over].balls
                  .sort((a, b) => (a.ballNumber || 0) - (b.ballNumber || 0))
                  .map((ball, idx) => {
                    const style = getBallStyle(ball);
                    return (
                      <Box 
                        key={idx}
                        sx={{ 
                          width: 26,
                          height: 26,
                          borderRadius: '6px',
                          bgcolor: style.bgcolor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: style.shadow
                        }}
                      >
                        <Typography sx={{ 
                          color: style.color, 
                          fontWeight: 700, 
                          fontSize: '0.7rem' 
                        }}>
                          {getBallText(ball)}
                        </Typography>
                      </Box>
                    );
                  })}
              </Box>
            </Box>

            {/* Balls in this over */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 0,
              ml: 1,
              borderLeft: '2px solid #e2e8f0',
              pl: 2
            }}>
              {groupedByOver[over].balls
                .sort((a, b) => (b.ballNumber || 0) - (a.ballNumber || 0))
                .map((ball, idx) => {
                  const style = getBallStyle(ball);
                  return (
                    <Box 
                      key={idx} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: 2,
                        py: 1.5,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: style.bgcolor,
                          border: '2px solid white',
                          boxShadow: '0 0 0 2px #e2e8f0'
                        }
                      }}
                    >
                      {/* Ball Badge */}
                      <Box sx={{ 
                        minWidth: 48,
                        px: 1,
                        py: 0.5,
                        bgcolor: style.bgcolor,
                        borderRadius: '6px',
                        textAlign: 'center',
                        boxShadow: style.shadow
                      }}>
                        <Typography sx={{ 
                          color: style.color, 
                          fontWeight: 700, 
                          fontSize: '0.7rem' 
                        }}>
                          {over}.{ball.ballNumber || idx + 1}
                        </Typography>
                      </Box>

                      {/* Commentary Text */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ 
                          color: '#1e293b', 
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          fontWeight: ball.isWicket || ball.runs >= 4 ? 500 : 400
                        }}>
                          {getCommentaryText(ball)}
                        </Typography>
                      </Box>

                      {/* Runs Badge */}
                      <Box sx={{ 
                        minWidth: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: ball.isWicket ? '#fef2f2' : ball.runs >= 4 ? '#f0fdf4' : '#f8fafc',
                        borderRadius: '10px',
                        border: `2px solid ${ball.isWicket ? '#fecaca' : ball.runs >= 4 ? '#bbf7d0' : '#e2e8f0'}`
                      }}>
                        <Typography sx={{ 
                          color: ball.isWicket ? '#dc2626' : ball.runs >= 4 ? '#16a34a' : '#64748b',
                          fontWeight: 700, 
                          fontSize: '0.9rem' 
                        }}>
                          {ball.isWicket ? 'W' : ball.runs || 0}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>

            {/* Divider between overs */}
            {overIdx < sortedOvers.length - 1 && (
              <Divider sx={{ mt: 2, borderColor: '#f1f5f9' }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CommentaryNew;
