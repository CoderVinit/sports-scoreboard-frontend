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
      background: '#f5f7fa',
      pb: 4
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Header */}
        <Paper 
          elevation={0}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            p: 3,
            background: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          <LiveTvIcon sx={{ fontSize: 32, mr: 2, color: '#d32f2f' }} />
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h5" 
              component="h1" 
              fontWeight={700} 
              sx={{ 
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                mb: 0.5,
                letterSpacing: '-0.01em'
              }}
            >
              Live Cricket Matches
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              fontWeight={500}
            >
              {liveMatches.length} {liveMatches.length === 1 ? 'match' : 'matches'} in progress
            </Typography>
          </Box>
        </Paper>

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

      <Grid container spacing={3}>
        {liveMatches && liveMatches.map((match) => {
          const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
          const inningsList = match.innings || [];
          const currentInnings =
            inningsList.find((inn) => inn.status === 'in_progress') ||
            inningsList.find((inn) => inn.inningsNumber === match.currentInnings) ||
            inningsList[inningsList.length - 1] ||
            inningsList[0] ||
            null;

          const currentOvers = parseFloat(currentInnings?.totalOvers || 0);
          const progress = getProgressPercentage(currentOvers, totalOvers);
          const isTeam1Batting = currentInnings?.battingTeamId === match.team1Id;
          
          // Determine batting and bowling teams for current innings
          const battingTeam = isTeam1Batting ? match.team1 : match.team2;
          const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
          const battingScore = currentInnings || { totalRuns: 0, totalWickets: 0, totalOvers: '0.0' };
          const bowlingScore = inningsList.find((inn) => inn.id !== currentInnings?.id) || { totalRuns: 0, totalWickets: 0 };

          const firstInnings = inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
          const secondInnings = inningsList.find((inn) => inn.inningsNumber === 2) || (inningsList.length > 1 ? inningsList[1] : null);

          const isCompletedByInnings = !!(firstInnings && secondInnings && secondInnings.status === 'completed');
          const winnerTeam =
            match.winnerId === match.team1Id
              ? match.team1
              : match.winnerId === match.team2Id
              ? match.team2
              : null;

          let resultText = '';
          if (isCompletedByInnings) {
            if (winnerTeam && match.winMargin) {
              resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
            } else {
              const firstRuns = firstInnings?.totalRuns || 0;
              const secondRuns = secondInnings?.totalRuns || 0;
              const target = secondInnings?.target || (firstRuns + 1);

              if (secondRuns >= target) {
                const wicketsRemaining = 10 - (secondInnings?.totalWickets || 0);
                const chasingTeam = secondInnings.battingTeamId === match.team1Id ? match.team1 : match.team2;
                const wk = wicketsRemaining > 0 ? wicketsRemaining : 1;
                resultText = `${chasingTeam.shortName || chasingTeam.name} won by ${wk} wicket${wk === 1 ? '' : 's'}`;
              } else if (firstRuns > secondRuns) {
                const margin = firstRuns - secondRuns;
                const defendingTeam = firstInnings.battingTeamId === match.team1Id ? match.team1 : match.team2;
                resultText = `${defendingTeam.shortName || defendingTeam.name} won by ${margin} run${margin === 1 ? '' : 's'}`;
              } else if (firstRuns === secondRuns) {
                resultText = 'Match tied';
              }
            }
          }
          
          return (
            <Grid item xs={12} md={6} key={match.id}>
              <Paper 
                component={Link} 
                to={`/match/${match.id}`}
                elevation={0}
                sx={{ 
                  position: 'relative',
                  textDecoration: 'none',
                  borderRadius: 2,
                  background: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #e0e0e0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    borderColor: '#1976d2',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {/* Live Badge */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                  <Chip 
                    label="LIVE" 
                    color="error" 
                    size="small" 
                    icon={<LiveTvIcon sx={{ fontSize: 14 }} />}
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 26,
                      boxShadow: '0 2px 4px rgba(211, 47, 47, 0.2)'
                    }}
                  />
                </Box>

                {/* Match Info Header */}
                <Box sx={{ 
                  p: 2.5, 
                  bgcolor: '#fafafa',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<SportsIcon sx={{ fontSize: 14 }} />} 
                      label={match.matchFormat || match.matchType} 
                      size="small" 
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                        px: 1
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontSize="0.875rem" fontWeight={500}>
                        {match.venue}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontSize="0.875rem" fontWeight={500}>
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Teams and Scores */}
                <Box sx={{ p: 3, flexGrow: 1 }}>
                  {/* Batting Team */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      p: 2.5,
                      borderRadius: 1.5,
                      background: '#1976d2',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar 
                          src={battingTeam?.logo} 
                          alt={battingTeam?.name}
                          sx={{ 
                            width: 44, 
                            height: 44,
                            background: 'rgba(255,255,255,0.25)',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            border: '2px solid rgba(255,255,255,0.3)'
                          }}
                        >
                          {battingTeam?.shortName?.charAt(0) || battingTeam?.name?.charAt(0) || 'T'}
                        </Avatar>
                        <Box>
                          <Typography 
                            variant="h6" 
                            fontWeight={700} 
                            sx={{ 
                              color: 'white',
                              mb: 0.5,
                              fontSize: '1.0625rem',
                              lineHeight: 1.3
                            }}
                          >
                            {battingTeam?.shortName || battingTeam?.name || 'Team'}
                          </Typography>
                          <Chip 
                            label="Batting" 
                            size="small" 
                            sx={{ 
                              height: 22,
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              background: 'rgba(255,255,255,0.25)',
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.2)'
                            }} 
                          />
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="h4" 
                          fontWeight={800} 
                          sx={{
                            color: 'white',
                            fontSize: { xs: '1.625rem', md: '1.875rem' },
                            lineHeight: 1,
                            mb: 0.5
                          }}
                        >
                          {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.95)',
                            fontSize: '0.8125rem',
                            fontWeight: 500
                          }}
                        >
                          ({battingScore.totalOvers || '0.0'}/{totalOvers} ov)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Bowling Team */}
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2.5,
                      borderRadius: 1.5,
                      background: '#fafafa',
                      border: '1px solid #e0e0e0'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                        <Avatar 
                          src={bowlingTeam?.logo} 
                          alt={bowlingTeam?.name}
                          sx={{ 
                            width: 44, 
                            height: 44,
                            background: '#9e9e9e',
                            fontSize: '1.125rem',
                            fontWeight: 700
                          }}
                        >
                          {bowlingTeam?.shortName?.charAt(0) || bowlingTeam?.name?.charAt(0) || 'T'}
                        </Avatar>
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          sx={{ 
                            color: 'text.primary',
                            fontSize: '1.0625rem',
                            lineHeight: 1.3
                          }}
                        >
                          {bowlingTeam?.shortName || bowlingTeam?.name || 'Team'}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 700,
                          fontSize: '0.9375rem'
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

                {/* Match Progress and Stats */}
                <Box sx={{ 
                  p: 3, 
                  bgcolor: '#fafafa',
                  borderTop: '1px solid #e0e0e0'
                }}>
                  {!isCompletedByInnings && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.875rem">
                          Match Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontSize="0.875rem" fontWeight={500}>
                          {currentOvers.toFixed(1)}/{totalOvers} overs
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 2,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            background: '#1976d2',
                            borderRadius: 2
                          }
                        }} 
                      />
                    </Box>
                  )}
                  
                  {/* Match Stats */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {isCompletedByInnings && resultText ? (
                        <Typography variant="body2" color="text.secondary" fontSize="0.875rem" fontWeight={600}>
                          Result: <strong style={{ color: '#1976d2', fontWeight: 700 }}>{resultText}</strong>
                        </Typography>
                      ) : (
                        <>
                          <TrendingUpIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                          <Typography variant="body2" color="text.secondary" fontSize="0.875rem" fontWeight={500}>
                            CRR: <strong style={{ color: '#1976d2', fontWeight: 700 }}>{getRunRate(battingScore.totalRuns || 0, currentOvers)}</strong>
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Chip 
                      label={isCompletedByInnings ? 'Completed' : 'Match in progress'} 
                      size="small" 
                      color={isCompletedByInnings ? 'default' : 'success'} 
                      sx={{ 
                        height: 24,
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  
                  {match.tossWinner && (
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2,
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="body2" fontWeight={500} color="text.primary" fontSize="0.875rem" sx={{ lineHeight: 1.5 }}>
                        {match.tossWinner} won the toss and chose to {match.tossDecision || 'bat'}
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
