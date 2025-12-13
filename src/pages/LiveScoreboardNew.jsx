import { Container, Box, Grid, Paper, Typography, Chip, Divider, LinearProgress, CircularProgress, Avatar } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import SportsIcon from '@mui/icons-material/Sports';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { matchService, inningsService } from '../api/services';
import { getSocket } from '../utils/socket';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(118, 75, 162, 0.6);
  }
`;

const LiveScoreboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await matchService.getLiveMatches();
        setLiveMatches(response.data || response.matches || []);
      } catch (err) {
        console.error('Error fetching live matches:', err);
        setError(err.message || 'Failed to load live matches');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();

    // Socket.IO real-time updates only (no polling)
    const socket = getSocket();
    
    socket.on('ballRecorded', () => {
      console.log('Ball recorded - refreshing live scoreboard');
      fetchLiveMatches();
    });

    return () => {
      socket.off('ballRecorded');
    };
  }, []);

  const getRunRate = (runs, overs) => {
    return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
  };

  const getProgressPercentage = (overs, totalOvers) => {
    return (overs / totalOvers) * 100;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (liveMatches.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LiveTvIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            No live matches at the moment
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for live cricket action!
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%)',
      pb: 6
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 5,
            p: { xs: 3, md: 4.5 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%)',
              backgroundSize: '20px 20px',
              opacity: 0.15,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(40px)',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 72, 
              height: 72, 
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              mr: 3,
              animation: `${pulse} 2s infinite`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <LiveTvIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                fontWeight={900} 
                sx={{ 
                  fontSize: { xs: '1.75rem', md: '2.75rem' },
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                  mb: 0.5,
                  letterSpacing: '-0.5px'
                }}
              >
                Live Cricket Matches
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.95, 
                  fontSize: { xs: '0.95rem', md: '1.15rem' },
                  fontWeight: 400,
                  textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
                }}
              >
                {liveMatches.length} {liveMatches.length === 1 ? 'match' : 'matches'} in progress
              </Typography>
            </Box>
          </Box>
        </Box>

      {liveMatches && liveMatches.length === 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            bgcolor: 'white',
            borderRadius: 3,
            border: '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <SportsIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={600}>
            No live matches at the moment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back soon for live cricket action!
          </Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        {liveMatches && liveMatches.map((match, index) => {
          const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
          const currentOvers = parseFloat(match.innings?.[0]?.totalOvers || 0);
          const progress = getProgressPercentage(currentOvers, totalOvers);
          const isTeam1Batting = match.innings?.[0]?.battingTeamId === match.team1Id;
          
          // Determine batting and bowling teams
          const battingTeam = isTeam1Batting ? match.team1 : match.team2;
          const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
          const battingScore = match.innings?.[0] || { totalRuns: 0, totalWickets: 0, totalOvers: '0.0' };
          const bowlingScore = match.innings?.[1] || { totalRuns: 0, totalWickets: 0 };
          
          return (
            <Grid item xs={12} md={6} key={match.id}>
              <Paper 
                component={Link} 
                to={`/match/${match.id}`}
                elevation={0}
                sx={{ 
                  position: 'relative',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  borderRadius: 4,
                  background: 'white',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '2px solid transparent',
                  animation: `${slideIn} 0.6s ease-out ${index * 0.15}s both`,
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                    borderColor: '#f44336',
                    animation: `${glow} 2s ease-in-out infinite`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                    borderRadius: '4px 4px 0 0',
                  }
                }}
              >
                {/* Live Badge */}
                <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
                  <Chip 
                    label="LIVE" 
                    color="error" 
                    size="small" 
                    icon={<LiveTvIcon sx={{ fontSize: 16 }} />}
                    sx={{ 
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      height: 32,
                      px: 1,
                      animation: `${pulse} 2s infinite`,
                      boxShadow: '0 4px 16px rgba(244, 67, 54, 0.5)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  />
                </Box>

                {/* Match Info Header */}
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'grey.50', 
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<SportsIcon sx={{ fontSize: 18 }} />} 
                      label={match.matchFormat || match.matchType} 
                      size="medium" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        height: 32,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {match.venue}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Teams and Scores */}
                <Box sx={{ p: 3.5 }}>
                  {/* Batting Team - Always on top */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 1.5,
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar 
                          src={battingTeam?.logo} 
                          alt={battingTeam?.name}
                          sx={{ 
                            width: 56, 
                            height: 56,
                            background: 'rgba(255,255,255,0.25)',
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            border: '2px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        >
                          {battingTeam?.shortName?.charAt(0) || battingTeam?.name?.charAt(0) || 'T'}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="h5" 
                            fontWeight={800} 
                            sx={{ 
                              lineHeight: 1.2,
                              color: 'white',
                              mb: 0.5
                            }}
                          >
                            {battingTeam?.shortName || battingTeam?.name || 'Team'}
                          </Typography>
                          <Chip 
                            label="Batting" 
                            size="small" 
                            sx={{ 
                              mt: 0.5, 
                              height: 24,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: 'rgba(255,255,255,0.25)',
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.3)'
                            }} 
                          />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="h2" 
                          fontWeight={900} 
                          sx={{
                            color: 'white',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            lineHeight: 1,
                            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                            mb: 0.5
                          }}
                        >
                          {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 600
                          }}
                        >
                          ({battingScore.totalOvers || '0.0'}/{totalOvers} overs)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />

                  {/* Bowling Team - Always on bottom */}
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Avatar 
                          src={bowlingTeam?.logo} 
                          alt={bowlingTeam?.name}
                          sx={{ 
                            width: 56, 
                            height: 56,
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
                          }}
                        >
                          {bowlingTeam?.shortName?.charAt(0) || bowlingTeam?.name?.charAt(0) || 'T'}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="h5" 
                            fontWeight={800} 
                            sx={{ 
                              lineHeight: 1.2,
                              color: 'text.primary',
                              mb: 0.5
                            }}
                          >
                            {bowlingTeam?.shortName || bowlingTeam?.name || 'Team'}
                          </Typography>
                          {bowlingScore.totalRuns > 0 && (
                            <Chip 
                              label="Batting" 
                              size="small" 
                              color="primary"
                              sx={{ 
                                mt: 0.5, 
                                height: 24,
                                fontSize: '0.7rem',
                                fontWeight: 700
                              }} 
                            />
                          )}
                        </Box>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 700,
                          fontSize: '1.25rem'
                        }}
                      >
                        {bowlingScore.totalRuns > 0 ? 
                          `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                          'Yet to bat'
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Match Progress */}
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'grey.50',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderTop: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        Match Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {currentOvers.toFixed(1)}/{totalOvers} overs
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.08)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
                        }
                      }} 
                    />
                  </Box>
                  
                  {/* Match Details Footer */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={700}>
                        CRR: <strong style={{ color: '#667eea', fontSize: '1.1rem' }}>{getRunRate(match.team1Score || 0, currentOvers)}</strong>
                      </Typography>
                    </Box>
                    <Chip 
                      label="Match in progress" 
                      size="small" 
                      color="success" 
                      sx={{ 
                        height: 28,
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
                      }}
                    />
                  </Box>
                  
                  {match.tossWinner && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      borderRadius: 2, 
                      background: 'rgba(102, 126, 234, 0.08)',
                      border: '1px solid rgba(102, 126, 234, 0.15)'
                    }}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        🏏 {match.tossWinner} won the toss and chose to {match.tossDecision || 'bat'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      </Container>
    </Box>
  );
};

export default LiveScoreboard;
