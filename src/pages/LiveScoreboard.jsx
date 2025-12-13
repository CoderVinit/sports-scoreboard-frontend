import { useState, useEffect } from 'react';
import { Container, Box, Grid, Paper, Typography, Chip, CircularProgress, Avatar, Divider, LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SportsIcon from '@mui/icons-material/Sports';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { matchService } from '../api/services';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const LiveScoreboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await matchService.getLiveMatches();
        setLiveMatches(response.data || response.matches || []);
      } catch (error) {
        console.error('Error fetching live matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    // Removed polling mechanism to align with no-polling requirement
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>Loading live matches...</Typography>
      </Box>
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
            mb: 4,
            p: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white',
            boxShadow: 3
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 56, 
            height: 56, 
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            mr: 2,
            animation: `${pulse} 2s ease-in-out infinite`
          }}>
            <LiveTvIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold">
              Live Cricket Matches
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {liveMatches.length} {liveMatches.length === 1 ? 'match' : 'matches'} in progress
            </Typography>
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

        <Grid container spacing={3}>
          {liveMatches && liveMatches.map((match) => {
            const totalOvers = match.matchType === 'T20' ? 20 : match.matchType === 'ODI' ? 50 : 90;
            const progress = match.team1Overs ? (match.team1Overs / totalOvers) * 100 : 0;
            const runRate = match.team1Overs > 0 ? (match.team1Score / match.team1Overs).toFixed(2) : '0.00';
            
            return (
              <Grid item xs={12} key={match.id}>
                <Paper 
                  component={Link} 
                  to={`/match/${match.id}`}
                  elevation={0}
                  sx={{ 
                    position: 'relative',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    borderRadius: 3,
                    background: 'white',
                    border: '2px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      borderColor: '#f44336',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                    }
                  }}
                >
                  {/* Live Badge */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                    <Chip 
                      label="LIVE" 
                      color="error" 
                      size="small" 
                      icon={<LiveTvIcon />}
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        height: 28,
                        animation: `${pulse} 2s ease-in-out infinite`,
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)'
                      }}
                    />
                  </Box>

                  {/* Match Info Header */}
                  <Box sx={{ p: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<SportsIcon />} 
                        label={match.matchType} 
                        size="small" 
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          {match.venue}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
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
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {/* Team 1 */}
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 1,
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ 
                                width: 48, 
                                height: 48,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}>
                                {(match.Team1?.name || 'T1').charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                  {match.Team1?.name || 'Team 1'}
                                </Typography>
                                {match.status === 'live' && (
                                  <Chip label="Batting" size="small" color="primary" sx={{ mt: 0.5, height: 20 }} />
                                )}
                              </Box>
                            </Box>
                            <Typography variant="h3" fontWeight="bold" sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              {match.team1Score || 0}/{match.team1Wickets || 0}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 6 }}>
                            ({match.team1Overs || 0}/{totalOvers} overs)
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Team 2 */}
                        <Box>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 2,
                            background: '#f8f9fa'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ 
                                width: 48, 
                                height: 48,
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                              }}>
                                {(match.Team2?.name || 'T2').charAt(0)}
                              </Avatar>
                              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                {match.Team2?.name || 'Team 2'}
                              </Typography>
                            </Box>
                            <Typography variant="h6" color="text.secondary" fontWeight="medium">
                              {match.team2Score ? `${match.team2Score}/${match.team2Wickets}` : 'Yet to bat'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            bgcolor: 'grey.50', 
                            p: 3,
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          {match.tossWinner && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight="medium" color="text.primary" gutterBottom>
                                🏏 {match.tossWinner?.shortName || match.tossWinner} won the toss and chose to {match.tossDecision || 'bat'}
                              </Typography>
                            </Box>
                          )}
                          
                          {match.team1Overs > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                  Match Progress
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {match.team1Overs}/{totalOvers} overs
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 2,
                                  bgcolor: 'grey.300',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: 2
                                  }
                                }} 
                              />
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <TrendingUpIcon sx={{ fontSize: 18, color: 'success.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                CRR: <strong>{runRate}</strong>
                              </Typography>
                            </Box>
                            <Chip 
                              label="Match in progress" 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
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
