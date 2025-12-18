import { Box, Typography, Chip, Container, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const MatchHeaderNew = ({ 
  match, 
  firstInnings, 
  secondInnings, 
  firstInningsBattingTeam, 
  secondInningsBattingTeam,
  currentInningsNumber,
  resultText,
  activeTab,
  onTabChange
}) => {
  const team1 = match?.team1 || match?.Team1;
  const team2 = match?.team2 || match?.Team2;

  const battingFirst = firstInningsBattingTeam || team1;
  const battingSecond = secondInningsBattingTeam || team2;

  const matchTabs = ['INFO', 'LIVE', 'SCORECARD', 'SQUADS', 'STATS'];

  const getStatusColor = () => {
    if (match?.status === 'live') return '#ef4444';
    if (match?.status === 'completed') return '#22c55e';
    return '#3b82f6';
  };

  const getStatusText = () => {
    if (match?.status === 'live') return 'LIVE';
    if (match?.status === 'completed') return 'COMPLETED';
    return 'UPCOMING';
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0c1929 0%, #1a365d 50%, #1e3a5f 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />

      {/* Top Navigation Bar */}
      <Box sx={{ 
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 1.5
          }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '10px', 
                  width: 36, 
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                }}>
                  <SportsCricketIcon sx={{ color: 'white', fontSize: 20 }} />
                </Box>
                <Typography sx={{ 
                  color: 'white', 
                  fontWeight: 800, 
                  fontSize: '1.2rem',
                  letterSpacing: '-0.5px'
                }}>
                  CricScore
                </Typography>
              </Box>
            </Link>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'rgba(255,255,255,0.6)' }}>
                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {match?.matchDate ? new Date(match.matchDate).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  }) : 'TBD'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'rgba(255,255,255,0.6)' }}>
                <PlaceIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  {match?.venue || 'TBD'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Score Section */}
      <Container maxWidth="xl">
        <Box sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          {/* Status Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Chip 
              label={getStatusText()}
              size="small"
              sx={{ 
                bgcolor: getStatusColor(),
                color: 'white', 
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 22,
                borderRadius: '6px',
                animation: match?.status === 'live' ? 'pulse 2s infinite' : 'none',
                boxShadow: `0 4px 12px ${getStatusColor()}50`,
                '& .MuiChip-label': { px: 1.5, letterSpacing: '0.5px' }
              }}
            />
          </Box>

          {/* Teams and Score */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: { xs: 3, md: 6 }
          }}>
            {/* Team 1 */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: { xs: 120, md: 180 }
            }}>
              <Avatar sx={{ 
                width: { xs: 56, md: 72 }, 
                height: { xs: 56, md: 72 }, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 800,
                mb: 1.5,
                border: currentInningsNumber === 1 && !secondInnings ? '3px solid #22c55e' : '3px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                {(battingFirst?.shortName || battingFirst?.name || 'T1').substring(0, 3).toUpperCase()}
              </Avatar>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.5, textAlign: 'center' }}>
                {battingFirst?.name || 'Team 1'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ 
                  fontWeight: 800, 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  letterSpacing: '-1px',
                  lineHeight: 1
                }}>
                  {firstInnings?.totalRuns || 0}/{firstInnings?.totalWickets || 0}
                </Typography>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.5)', 
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                  fontWeight: 500
                }}>
                  ({firstInnings?.totalOvers || '0.0'})
                </Typography>
              </Box>
            </Box>

            {/* VS Divider */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 0.75
            }}>
              <Box sx={{ 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  letterSpacing: '1px'
                }}>
                  VS
                </Typography>
              </Box>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.4)', 
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
              }}>
                {match?.matchFormat || match?.matchType || 'T20'}
              </Typography>
            </Box>

            {/* Team 2 */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: { xs: 120, md: 180 }
            }}>
              <Avatar sx={{ 
                width: { xs: 56, md: 72 }, 
                height: { xs: 56, md: 72 }, 
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 800,
                mb: 1.5,
                border: currentInningsNumber === 2 && secondInnings ? '3px solid #22c55e' : '3px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                {(battingSecond?.shortName || battingSecond?.name || 'T2').substring(0, 3).toUpperCase()}
              </Avatar>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.5, textAlign: 'center' }}>
                {battingSecond?.name || 'Team 2'}
              </Typography>
              {secondInnings ? (
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                  <Typography sx={{ 
                    fontWeight: 800, 
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    letterSpacing: '-1px',
                    lineHeight: 1
                  }}>
                    {secondInnings.totalRuns || 0}/{secondInnings.totalWickets || 0}
                  </Typography>
                  <Typography sx={{ 
                    color: 'rgba(255,255,255,0.5)', 
                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                    fontWeight: 500
                  }}>
                    ({secondInnings.totalOvers || '0.0'})
                  </Typography>
                </Box>
              ) : (
                <Typography sx={{ 
                  color: 'rgba(255,255,255,0.35)', 
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  Yet to bat
                </Typography>
              )}
            </Box>
          </Box>

          {/* Result Text */}
          {resultText && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 3,
                py: 1,
                bgcolor: 'rgba(34, 197, 94, 0.15)',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.25)'
              }}>
                <Typography sx={{ fontSize: '1rem' }}>🏆</Typography>
                <Typography sx={{ 
                  color: '#4ade80', 
                  fontSize: '0.85rem', 
                  fontWeight: 600 
                }}>
                  {resultText}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      {/* Match Tabs */}
      <Box sx={{ 
        bgcolor: 'rgba(0,0,0,0.25)',
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            gap: 0,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            {matchTabs.map((tab) => (
              <Box 
                key={tab}
                onClick={() => onTabChange && onTabChange(tab)}
                sx={{ 
                  px: { xs: 2, md: 3 }, 
                  py: 1.5, 
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.05)' 
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: activeTab === tab ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                    width: '70%',
                    height: '3px',
                    bgcolor: '#ef4444',
                    borderRadius: '3px 3px 0 0',
                    transition: 'transform 0.2s ease'
                  }
                }}
              >
                <Typography sx={{ 
                  color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: activeTab === tab ? 700 : 500,
                  fontSize: '0.8rem',
                  letterSpacing: '0.3px',
                  transition: 'color 0.2s ease'
                }}>
                  {tab}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MatchHeaderNew;
