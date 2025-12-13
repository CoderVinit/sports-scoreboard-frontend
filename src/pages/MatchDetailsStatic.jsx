import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Paper, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Tabs, Tab, Card, Divider, CircularProgress, Avatar
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { matchService, playerService } from '../api/services';
import { getSocket } from '../utils/socket';

// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Team color mapping based on country
const getTeamColors = (teamName) => {
  if (!teamName) return { 
    primary: '#1976d2', 
    secondary: '#1565c0', 
    accent: '#42a5f5',
    bgColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)'
  };
  
  const name = teamName.toLowerCase();
  
  // India - Saffron, White, Green
  if (name.includes('india') || name.includes('ind')) {
    return {
      primary: '#FF9933', // Saffron
      secondary: '#FF8800',
      accent: '#138808', // Green
      bgColor: hexToRgba('#FF9933', 0.25),
      borderColor: hexToRgba('#FF9933', 0.5)
    };
  }
  
  // Australia - Green and Gold
  if (name.includes('australia') || name.includes('aus')) {
    return {
      primary: '#00843D', // Green
      secondary: '#006B2D',
      accent: '#FFCD00', // Gold
      bgColor: hexToRgba('#00843D', 0.25),
      borderColor: hexToRgba('#00843D', 0.5)
    };
  }
  
  // England - Red, White, Blue
  if (name.includes('england') || name.includes('eng')) {
    return {
      primary: '#C8102E', // Red
      secondary: '#A00E26',
      accent: '#012169', // Blue
      bgColor: hexToRgba('#C8102E', 0.25),
      borderColor: hexToRgba('#C8102E', 0.5)
    };
  }
  
  // Pakistan - Green and White
  if (name.includes('pakistan') || name.includes('pak')) {
    return {
      primary: '#01411C', // Dark Green
      secondary: '#003D14',
      accent: '#FFFFFF',
      bgColor: hexToRgba('#01411C', 0.25),
      borderColor: hexToRgba('#01411C', 0.5)
    };
  }
  
  // New Zealand - Black
  if (name.includes('zealand') || name.includes('nz')) {
    return {
      primary: '#000000', // Black
      secondary: '#1a1a1a',
      accent: '#FFFFFF',
      bgColor: hexToRgba('#000000', 0.3),
      borderColor: hexToRgba('#000000', 0.5)
    };
  }
  
  // South Africa - Green, Gold, Red, Blue, Black, White
  if (name.includes('south africa') || name.includes('sa') || name.includes('proteas')) {
    return {
      primary: '#007A4D', // Green
      secondary: '#006B42',
      accent: '#FFB612', // Gold
      bgColor: hexToRgba('#007A4D', 0.25),
      borderColor: hexToRgba('#007A4D', 0.5)
    };
  }
  
  // West Indies - Maroon, Gold, Green
  if (name.includes('west indies') || name.includes('wi')) {
    return {
      primary: '#7B2D2D', // Maroon
      secondary: '#5A1F1F',
      accent: '#FFD700', // Gold
      bgColor: hexToRgba('#7B2D2D', 0.25),
      borderColor: hexToRgba('#7B2D2D', 0.5)
    };
  }
  
  // Bangladesh - Red and Green
  if (name.includes('bangladesh') || name.includes('ban')) {
    return {
      primary: '#006A4E', // Green
      secondary: '#005A3E',
      accent: '#F42A41', // Red
      bgColor: hexToRgba('#006A4E', 0.25),
      borderColor: hexToRgba('#006A4E', 0.5)
    };
  }
  
  // Sri Lanka - Maroon and Gold
  if (name.includes('sri lanka') || name.includes('sl')) {
    return {
      primary: '#FFBE29', // Gold
      secondary: '#FFA500',
      accent: '#8B0000', // Maroon
      bgColor: hexToRgba('#FFBE29', 0.25),
      borderColor: hexToRgba('#FFBE29', 0.5)
    };
  }
  
  // Afghanistan - Black, Red, Green
  if (name.includes('afghanistan') || name.includes('afg')) {
    return {
      primary: '#000000', // Black
      secondary: '#1a1a1a',
      accent: '#D32011', // Red
      bgColor: hexToRgba('#000000', 0.3),
      borderColor: hexToRgba('#000000', 0.5)
    };
  }
  
  // Default - Blue
  return {
    primary: '#1976d2',
    secondary: '#1565c0',
    accent: '#42a5f5',
    bgColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)'
  };
};

const MatchDetails = () => {
  const { matchId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [match, setMatch] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [team1Squad, setTeam1Squad] = useState([]);
  const [team2Squad, setTeam2Squad] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const [matchData, statsData, commentaryData] = await Promise.all([
          matchService.getMatchDetails(matchId),
          matchService.getMatchStatistics(matchId),
          matchService.getMatchCommentary(matchId)
        ]);
        
        console.log('Commentary data:', commentaryData); // Debug log
        
        const matchInfo = matchData.data || matchData.match;
        const stats = statsData.data || statsData;
        
        console.log('Match Info:', matchInfo);
        console.log('Statistics:', stats);
        console.log('Current Innings:', matchInfo?.innings);
        
        setMatch(matchInfo);
        setStatistics(stats);
        setCommentary(commentaryData.data || commentaryData.commentary || []);
        
        // Fetch squads for both teams
        if (matchInfo?.team1Id && matchInfo?.team2Id) {
          try {
            const [team1Players, team2Players] = await Promise.all([
              playerService.getPlayersByTeam(matchInfo.team1Id),
              playerService.getPlayersByTeam(matchInfo.team2Id)
            ]);
            setTeam1Squad(team1Players.data || team1Players.players || []);
            setTeam2Squad(team2Players.data || team2Players.players || []);
          } catch (error) {
            console.error('Error fetching squad data:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching match data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();

   
    // Socket.IO real-time updates
    const socket = getSocket();
    
    socket.on('ballRecorded', async (data) => {
      if (data.matchId === parseInt(matchId)) {
        console.log('Ball recorded - updating data in real-time', data);
        // Refresh all data when a new ball is recorded
        try {
          const [matchData, statsData, commentaryData] = await Promise.all([
            matchService.getMatchDetails(matchId),
            matchService.getMatchStatistics(matchId),
            matchService.getMatchCommentary(matchId)
          ]);
          
          const matchInfo = matchData.data || matchData.match;
          const stats = statsData.data || statsData;
          
          console.log('Updated after ball - Match:', matchInfo);
          console.log('Updated after ball - Statistics:', stats);
          
          setMatch(matchInfo);
          setStatistics(stats);
          setCommentary(commentaryData.data || commentaryData.commentary || []);
        } catch (error) {
          console.error('Error updating data after ball:', error);
        }
      }
    });

    return () => {
      socket.off('ballRecorded');
    };
  }, [matchId]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!match) {
    return <Container><Typography>Match not found</Typography></Container>;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get team colors dynamically
  const team1Colors = getTeamColors(match.team1?.name || match.team1?.shortName);
  const team2Colors = getTeamColors(match.team2?.name || match.team2?.shortName);

  // Derive innings information
  const inningsList = match.innings || [];

  const getTeamById = (teamId) => {
    if (!teamId) return null;
    if (teamId === match.team1Id) return match.team1;
    if (teamId === match.team2Id) return match.team2;
    return null;
  };

  const firstInnings = inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
  const secondInnings = inningsList.find((inn) => inn.inningsNumber === 2) || null;

  const currentInningsNumber = match.currentInnings || (secondInnings ? 2 : 1);
  const currentInnings =
    inningsList.find((inn) => inn.inningsNumber === currentInningsNumber) ||
    secondInnings ||
    firstInnings;

  const firstInningsBattingTeam = firstInnings
    ? firstInnings.battingTeam || getTeamById(firstInnings.battingTeamId)
    : null;
  const secondInningsBattingTeam = secondInnings
    ? secondInnings.battingTeam || getTeamById(secondInnings.battingTeamId)
    : null;

  // Primary innings to display in header (usually current innings)
  const primaryInnings = currentInnings || firstInnings;
  const primaryBattingTeam = primaryInnings
    ? primaryInnings.battingTeam || getTeamById(primaryInnings.battingTeamId)
    : null;

  // Result text when match is finished / both innings done
  const winnerTeam = match.winner || getTeamById(match.winnerId);
  let resultText = '';

  if (match.status === 'completed' || (firstInnings && secondInnings)) {
    if (winnerTeam && match.winMargin) {
      resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
    } else if (match.resultType === 'tie') {
      resultText = 'Match tied';
    } else if (match.resultType === 'no_result') {
      resultText = 'No result';
    } else if (firstInnings && secondInnings) {
      const firstRuns = firstInnings.totalRuns || 0;
      const secondRuns = secondInnings.totalRuns || 0;
      const target = secondInnings.target || (firstRuns + 1);

      if (secondRuns >= target) {
        const wicketsRemaining = 10 - (secondInnings.totalWickets || 0);
        const chasingTeam = secondInningsBattingTeam || getTeamById(secondInnings.battingTeamId);
        if (chasingTeam) {
          const wk = wicketsRemaining > 0 ? wicketsRemaining : 1;
          resultText = `${chasingTeam.shortName || chasingTeam.name} won by ${wk} wicket${wk === 1 ? '' : 's'}`;
        }
      } else if (firstRuns > secondRuns) {
        const margin = firstRuns - secondRuns;
        const defendingTeam = firstInningsBattingTeam || getTeamById(firstInnings.battingTeamId);
        if (defendingTeam) {
          resultText = `${defendingTeam.shortName || defendingTeam.name} won by ${margin} run${margin === 1 ? '' : 's'}`;
        }
      } else if (firstRuns === secondRuns) {
        resultText = 'Match tied';
      }
    }
  }

  return (
    <Container maxWidth={false} sx={{ py: 0, px: 0 }}>
      {/* Match Header - New Design */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)' 
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 4, 
            background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
            color: 'white',
            borderRadius: 0,
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '1400px',
            width: '100%',
            boxShadow: 'none'
          }}
        >
        {/* Top Info Bar */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
            {new Date(match.matchDate || match.date).toLocaleDateString('en-US', { 
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }) + ', ' + new Date(match.matchDate || match.date).toLocaleTimeString('en-US', { 
              hour: '2-digit', minute: '2-digit', hour12: false
            })}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
            {match.matchFormat || match.matchType} Match
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {match.venue}
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
              ☀️ 23°
            </Typography>
          </Box>
        </Box>

        {/* LIVE Badge */}
        {match.status === 'live' && (
          <Chip 
            label="LIVE" 
            icon={<SportsCricketIcon sx={{ fontSize: 14 }} />}
            sx={{ 
              position: 'absolute',
              left: 24,
              top: 100,
              bgcolor: '#e53935',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 26,
              px: 1,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.8 }
              }
            }}
          />
        )}

        {/* Teams Score Section */}
        <Box sx={{ mb: 3 }}>
          {/* Second Innings (Current/Latest) - Show if exists */}
          {secondInnings && secondInningsBattingTeam && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 28, 
                  bgcolor: 'white', 
                  borderRadius: 0.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0a1f44'
                }}>
                  {(secondInningsBattingTeam.shortName || secondInningsBattingTeam.name || 'T').substring(0, 3).toUpperCase()}
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  {secondInningsBattingTeam.name || secondInningsBattingTeam.shortName}
                </Typography>
                {match.status === 'live' && currentInningsNumber === 2 && (
                  <SportsCricketIcon sx={{ fontSize: 20, ml: 1, cursor: 'pointer' }} />
                )}
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                {secondInnings.totalRuns ?? 0}/{secondInnings.totalWickets ?? 0}
                <Typography component="span" variant="h6" sx={{ ml: 1, opacity: 0.8, fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  ({secondInnings.totalOvers || '0.0'})
                </Typography>
              </Typography>
            </Box>
          )}

          {/* First Innings */}
          {firstInnings && firstInningsBattingTeam && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 28, 
                  bgcolor: 'white', 
                  borderRadius: 0.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0a1f44'
                }}>
                  {(firstInningsBattingTeam.shortName || firstInningsBattingTeam.name || 'T').substring(0, 3).toUpperCase()}
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  {firstInningsBattingTeam.name || firstInningsBattingTeam.shortName}
                </Typography>
                {match.status === 'live' && currentInningsNumber === 1 && !secondInnings && (
                  <SportsCricketIcon sx={{ fontSize: 20, ml: 1, cursor: 'pointer' }} />
                )}
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                {firstInnings.totalRuns || 0}/{firstInnings.totalWickets || 0}
                <Typography component="span" variant="h6" sx={{ ml: 1, opacity: 0.8, fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  ({firstInnings.totalOvers || '0.0'})
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>

        {/* Match Status */}
        {resultText ? (
          <Typography variant="body1" sx={{ mb: 3, fontWeight: 600, fontSize: '0.95rem' }}>
            {resultText}
          </Typography>
        ) : secondInnings?.target && secondInningsBattingTeam && (
          <Typography variant="body1" sx={{ mb: 3, fontWeight: 600, fontSize: '0.95rem' }}>
            {secondInningsBattingTeam?.shortName || secondInningsBattingTeam?.name} need {(secondInnings.target - secondInnings.totalRuns)} runs to win
          </Typography>
        )}

        {/* Toss Info */}
        <Typography variant="body2" sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'rgba(255,255,255,0.1)', opacity: 0.9 }}>
          {match.tossWinner?.shortName || match.tossWinner?.name || 'Team'} won the toss and chose to {match.tossDecision}
        </Typography>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 2, 
        borderColor: '#1976d2',
        mb: 3,
        bgcolor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#666',
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              minHeight: 48,
              '&.Mui-selected': {
                color: '#1976d2',
                fontWeight: 700
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              bgcolor: '#1976d2'
            }
          }}
        >
          <Tab label="Scorecard" />
          <Tab label="Commentary" />
          <Tab label="Statistics" />
          <Tab label="Squads" />
        </Tabs>
      </Box>

      {/* Scorecard Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Batting Scorecard */}
          <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)',
              color: 'white', 
              p: 2.5,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
                {currentInnings?.battingTeam?.shortName || currentInnings?.battingTeam?.name || 
                 (currentInnings?.battingTeamId === match.team1Id ? (match.team1?.shortName || match.team1?.name) : (match.team2?.shortName || match.team2?.name)) || 
                 'Team'} Innings - {currentInnings?.totalRuns || 0}/{currentInnings?.totalWickets || 0} ({currentInnings?.totalOvers || '0.0'} ov)
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Batter</strong></TableCell>
                    <TableCell align="center"><strong>R</strong></TableCell>
                    <TableCell align="center"><strong>B</strong></TableCell>
                    <TableCell align="center"><strong>4s</strong></TableCell>
                    <TableCell align="center"><strong>6s</strong></TableCell>
                    <TableCell align="center"><strong>SR</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics?.battingStats?.length > 0 ? statistics.battingStats.map((stat, index) => {
                    console.log('Batting stat:', stat); // Debug log
                    console.log('Player ID:', stat.player?.id);
                    console.log('Current Innings Striker ID:', currentInnings?.strikerId);
                    console.log('Statistics Striker ID:', statistics?.currentStriker?.id);
                    console.log('Is Out:', stat.isOut);
                    
                    // Determine if this batsman is on strike
                    // Priority: stat.isOnStrike > currentInnings.strikerId > statistics.currentStriker
                    // For not-out batsmen, if only one is not out, mark as on strike
                    const notOutBatsmen = statistics?.battingStats?.filter(s => !s.isOut) || [];
                    
                    let isOnStrike = false;
                    if (stat.isOnStrike === true) {
                      isOnStrike = true;
                    } else if (currentInnings?.strikerId && stat.player?.id === currentInnings?.strikerId) {
                      isOnStrike = true;
                    } else if (statistics?.currentStriker?.id && stat.player?.id === statistics?.currentStriker?.id) {
                      isOnStrike = true;
                    } else if (!stat.isOut && notOutBatsmen.length === 1) {
                      // If only one batsman is not out, they must be on strike
                      isOnStrike = true;
                    } else if (!stat.isOut && notOutBatsmen.length === 2 && index === statistics.battingStats.findIndex(s => !s.isOut)) {
                      // If two batsmen are not out and no striker info, mark the first not-out as striker
                      isOnStrike = true;
                    }
                    
                    console.log('Is On Strike:', isOnStrike);
                    
                    // Format dismissal text
                    let dismissalText = '';
                    if (!stat.isOut) {
                      dismissalText = 'Not Out';
                    } else {
                      const dismissalType = stat.dismissalType;
                      const bowler = stat.dismissalBowler?.name;
                      const fielder = stat.dismissalFielder?.name;
                      
                      if (dismissalType === 'caught' && fielder && bowler) {
                        dismissalText = `c ${fielder} b ${bowler}`;
                      } else if (dismissalType === 'bowled' && bowler) {
                        dismissalText = `b ${bowler}`;
                      } else if (dismissalType === 'lbw' && bowler) {
                        dismissalText = `lbw b ${bowler}`;
                      } else if (dismissalType === 'stumped' && fielder && bowler) {
                        dismissalText = `st ${fielder} b ${bowler}`;
                      } else if (dismissalType === 'run_out' && fielder) {
                        dismissalText = `run out (${fielder})`;
                      } else if (dismissalType === 'hit_wicket' && bowler) {
                        dismissalText = `hit wicket b ${bowler}`;
                      } else {
                        dismissalText = dismissalType || 'out';
                      }
                    }

                    return (
                      <TableRow key={index} sx={{ bgcolor: isOnStrike ? 'success.lighter' : 'inherit' }}>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={isOnStrike ? 'bold' : 'normal'}>
                              {stat.player?.name} {isOnStrike && '⭐'}
                            </Typography>
                            <Typography variant="caption" color={!stat.isOut ? 'success.main' : 'text.secondary'} sx={{ fontStyle: 'italic' }}>
                              {dismissalText}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{stat.runsScored || 0}</TableCell>
                        <TableCell align="center">{stat.ballsFaced || 0}</TableCell>
                        <TableCell align="center">{stat.fours || 0}</TableCell>
                        <TableCell align="center">{stat.sixes || 0}</TableCell>
                        <TableCell align="center">{parseFloat(stat.strikeRate || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">No batting statistics available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Extras & Total */}
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">
                <strong>Extras:</strong> {currentInnings?.extras || 0}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <strong>Total:</strong> {currentInnings?.totalRuns || 0}/{currentInnings?.totalWickets || 0} ({currentInnings?.totalOvers || '0.0'} ov)
              </Typography>
            </Box>
          </Paper>

          {/* First Innings Summary Card (when second innings is active) */}
          {secondInnings && firstInnings && (
            <Card sx={{ mb: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderLeft: '4px solid #1976d2'
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0d47a1' }}>
                  1st Innings Summary - {firstInningsBattingTeam?.shortName || firstInningsBattingTeam?.name || 'Team'}
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body1">
                  {firstInnings.totalRuns || 0}/{firstInnings.totalWickets || 0} ({firstInnings.totalOvers || '0.0'} ov)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Extras: {firstInnings.extras || 0} • Run Rate: {firstInnings.runRate || '0.00'}
                </Typography>
              </Box>
            </Card>
          )}

          {/* Bowling Scorecard */}
          <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
              color: 'white', 
              p: 2.5,
              boxShadow: '0 2px 8px rgba(21, 101, 192, 0.3)'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
                {currentInnings?.bowlingTeam?.shortName || currentInnings?.bowlingTeam?.name ||
                 (currentInnings?.bowlingTeamId === match.team1Id
                   ? (match.team1?.shortName || match.team1?.name)
                   : (match.team2?.shortName || match.team2?.name)) ||
                 'Team'} Bowling
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Bowler</strong></TableCell>
                    <TableCell align="center"><strong>O</strong></TableCell>
                    <TableCell align="center"><strong>M</strong></TableCell>
                    <TableCell align="center"><strong>R</strong></TableCell>
                    <TableCell align="center"><strong>W</strong></TableCell>
                    <TableCell align="center"><strong>Econ</strong></TableCell>
                    <TableCell align="center"><strong>Wd</strong></TableCell>
                    <TableCell align="center"><strong>Nb</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics?.bowlingStats?.length > 0 ? statistics.bowlingStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell><strong>{stat.player?.name}</strong></TableCell>
                      <TableCell align="center">{parseFloat(stat.oversBowled || 0).toFixed(1)}</TableCell>
                      <TableCell align="center">{stat.maidenOvers || 0}</TableCell>
                      <TableCell align="center">{stat.runsConceded || 0}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {stat.wicketsTaken || 0}
                      </TableCell>
                      <TableCell align="center">{parseFloat(stat.economyRate || 0).toFixed(2)}</TableCell>
                      <TableCell align="center">{stat.wides || 0}</TableCell>
                      <TableCell align="center">{stat.noBalls || 0}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary">No bowling statistics available</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Fall of Wickets */}
          <Card sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
                Fall of Wickets
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {statistics?.fallOfWickets?.length > 0 ? statistics.fallOfWickets.map((fow, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Typography variant="body2" fontWeight="bold">
                      {fow.teamScore}-{fow.wicket} ({fow.over} ov)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fow.playerName || fow.player?.name}
                    </Typography>
                  </Grid>
                )) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No wickets fallen yet
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>

          {/* Partnerships */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              color: 'white'
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
                Partnerships
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {statistics?.partnerships?.length > 0 ? statistics.partnerships.map((partnership, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < statistics.partnerships.length - 1 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="body1" fontWeight="bold">
                    {partnership.wicketNumber === 0 ? 'Current' : `${partnership.wicketNumber}${partnership.wicketNumber === 1 ? 'st' : partnership.wicketNumber === 2 ? 'nd' : partnership.wicketNumber === 3 ? 'rd' : 'th'} Wicket`}: {partnership.runs} runs ({partnership.balls} balls)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {partnership.batsman1?.name} {partnership.batsman1Runs}*, {partnership.batsman2?.name} {partnership.batsman2Runs}*
                  </Typography>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">No partnership data available</Typography>
              )}
            </Box>
          </Card>
        </Box>
      )}

      {/* Commentary Tab */}
      {tabValue === 1 && (
        <Paper elevation={2} sx={{ overflow: 'hidden' }}>
          <Box sx={{ 
            p: 2.5, 
            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            color: 'white'
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
              Live Commentary
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
          {commentary && commentary.length > 0 ? commentary.map((comment, index) => (
            <Box 
              key={comment.id || index} 
              sx={{ 
                mb: 2, 
                pb: 2, 
                borderBottom: index < commentary.length - 1 ? 1 : 0, 
                borderColor: 'divider' 
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip 
                  label={`${comment.overNumber || comment.over}`}
                  size="small" 
                  color="primary" 
                  sx={{ fontWeight: 'bold' }}
                />
                {comment.isWicket && (
                  <Chip label="WICKET" size="small" color="error" />
                )}
                {comment.runs && !(comment.isWicket) && (
                  <Chip label={`${comment.runs}`} size="small" color="success" />
                )}
              </Box>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {comment.text || comment.commentary || 'No commentary available'}
              </Typography>
              {comment.commentary && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {comment.bowler} to {comment.batsman}
                </Typography>
              )}
            </Box>
          )) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No commentary available yet. Start recording balls to see commentary.
            </Typography>
          )}
          </Box>
        </Paper>
      )}

      {/* Statistics Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                color: 'white' 
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
                  Match Statistics
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Runs</Typography>
                    <Typography variant="h5" fontWeight="bold">{currentInnings?.totalRuns || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Wickets</Typography>
                    <Typography variant="h5" fontWeight="bold">{currentInnings?.totalWickets || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Run Rate</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {currentInnings?.runRate || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Extras</Typography>
                    <Typography variant="h5" fontWeight="bold">{currentInnings?.extras || 0}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ overflow: 'hidden' }}>
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                color: 'white' 
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
                  Scoring Breakdown
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {(() => {
                  // Calculate runs from boundaries (4s and 6s)
                  const totalFours = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.fours || 0), 0) || 0;
                  const totalSixes = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.sixes || 0), 0) || 0;
                  const boundaryRuns = (totalFours * 4) + (totalSixes * 6);
                  const totalRuns = currentInnings?.totalRuns || 0;
                  const boundaryPercentage = totalRuns > 0 ? ((boundaryRuns / totalRuns) * 100).toFixed(0) : 0;

                  // Calculate total balls faced
                  const totalBallsFaced = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.ballsFaced || 0), 0) || 0;
                  
                  // Calculate dot balls (balls where batsman scored 0)
                  // This is approximate: totalBalls - (balls that scored runs)
                  const totalRunScoringBalls = statistics?.battingStats?.reduce((sum, stat) => {
                    // Approximate: runs / avg runs per scoring ball
                    // For simplicity, we'll calculate from boundaries and assume rest are 1s, 2s, 3s
                    const boundaryBalls = (stat.fours || 0) + (stat.sixes || 0);
                    const nonBoundaryRuns = (stat.runsScored || 0) - ((stat.fours || 0) * 4) - ((stat.sixes || 0) * 6);
                    // Assume non-boundary scoring balls are mostly singles/doubles (avg ~1.5 runs)
                    const nonBoundaryBalls = nonBoundaryRuns > 0 ? Math.round(nonBoundaryRuns / 1.5) : 0;
                    return sum + boundaryBalls + nonBoundaryBalls;
                  }, 0) || 0;
                  
                  const dotBalls = totalBallsFaced - totalRunScoringBalls;
                  const dotBallPercentage = totalBallsFaced > 0 ? ((dotBalls / totalBallsFaced) * 100).toFixed(0) : 0;

                  return (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Runs in Boundaries
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {boundaryRuns} ({boundaryPercentage}% of total)
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {totalFours} fours, {totalSixes} sixes
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                        Dot balls percentage
                      </Typography>
                      <Typography variant="h6">{dotBallPercentage}%</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dotBalls} dot balls out of {totalBallsFaced} balls
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Squads Tab */}
      {tabValue === 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Grid container spacing={0} sx={{ maxWidth: '1800px'}}>
            {/* Team 1 Squad */}
            <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pr: { md: 1 } }}>
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              {/* Team Header */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                color: 'white', 
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
              }}>
                <Box sx={{
                  width: 40,
                  height: 28,
                  bgcolor: 'white',
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  🏏
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {match.team1?.name || 'Team 1'}
                </Typography>
              </Box>
              
              {/* Squads Label */}
              <Box sx={{ bgcolor: '#f5f5f5', px: 2.5, py: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333', letterSpacing: '0.5px' }}>
                  SQUADS
                </Typography>
              </Box>

              {/* Players List */}
              <Box sx={{ bgcolor: 'white' }}>
                {team1Squad.length > 0 ? team1Squad.map((player) => {
                  // Determine role suffix
                  let roleSuffix = '';
                  if (player.role?.toLowerCase().includes('captain')) {
                    roleSuffix = ' (c)';
                  } else if (player.role?.toLowerCase().includes('wicket')) {
                    roleSuffix = ' (wk)';
                  }
                  
                  return (
                    <Box
                      key={player.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 2.5,
                        py: 2,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                          borderBottom: 'none'
                        },
                        '&:hover': {
                          bgcolor: '#fafafa'
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#d0d0d0',
                          width: 40,
                          height: 40,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          color: '#666'
                        }}
                      >
                        {player.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" fontWeight="600" sx={{ color: '#000' }}>
                        {player.name}{roleSuffix}
                      </Typography>
                    </Box>
                  );
                }) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No squad information available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Team 2 Squad */}
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{ pl: { md: 1 } }}>
            <Paper elevation={2} sx={{ overflow: 'hidden' }}>
              {/* Team Header */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                color: 'white', 
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
              }}>
                <Box sx={{
                  width: 40,
                  height: 28,
                  bgcolor: 'white',
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  🏏
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {match.team2?.name || 'Team 2'}
                </Typography>
              </Box>
              
              {/* Squads Label */}
              <Box sx={{ bgcolor: '#f5f5f5', px: 2.5, py: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#333', letterSpacing: '0.5px' }}>
                  SQUADS
                </Typography>
              </Box>

              {/* Players List */}
              <Box sx={{ bgcolor: 'white' }}>
                {team2Squad.length > 0 ? team2Squad.map((player) => {
                  // Determine role suffix
                  let roleSuffix = '';
                  if (player.role?.toLowerCase().includes('captain')) {
                    roleSuffix = ' (c)';
                  } else if (player.role?.toLowerCase().includes('wicket')) {
                    roleSuffix = ' (wk)';
                  }
                  
                  return (
                    <Box
                      key={player.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 2.5,
                        py: 2,
                        borderBottom: '1px solid #e0e0e0',
                        '&:last-child': {
                          borderBottom: 'none'
                        },
                        '&:hover': {
                          bgcolor: '#fafafa'
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: '#d0d0d0',
                          width: 40,
                          height: 40,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          color: '#666'
                        }}
                      >
                        {player.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" fontWeight="600" sx={{ color: '#000' }}>
                        {player.name}{roleSuffix}
                      </Typography>
                    </Box>
                  );
                }) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No squad information available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default MatchDetails;
