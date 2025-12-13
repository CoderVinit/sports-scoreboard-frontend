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
import { matchService } from '../api/services';
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
        
        setMatch(matchData.data || matchData.match);
        setStatistics(statsData.data || statsData);
        setCommentary(commentaryData.data || commentaryData.commentary || []);
      } catch (error) {
        console.error('Error fetching match data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();

   
    // Socket.IO real-time updates
    const socket = getSocket();
    
    socket.on('ballRecorded', (data) => {
      if (data.matchId === parseInt(matchId)) {
        console.log('Ball recorded - updating data in real-time');
        // Refresh all data when a new ball is recorded
        fetchMatchData();
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Match Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          mb: 4, 
          bgcolor: '#1976d2', 
          color: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
        }}
      >
        {/* Header Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <Chip 
                label={match.matchFormat || match.matchType}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  height: 28
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LocationOnIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, fontSize: '0.9375rem' }}>
                  {match.venue}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayIcon sx={{ fontSize: 18, opacity: 0.9 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.125rem' } }}>
                {new Date(match.matchDate || match.date).toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
          {match.status === 'live' && (
            <Chip 
              label="LIVE" 
              color="error" 
              icon={<LiveTvIcon sx={{ fontSize: 16 }} />}
              sx={{ 
                color: 'white', 
                bgcolor: '#d32f2f',
                fontWeight: 700,
                fontSize: '0.8125rem',
                height: 32,
                boxShadow: '0 2px 4px rgba(211, 47, 47, 0.3)'
              }}
            />
          )}
        </Box>

        {/* Score Display */}
        <Grid container spacing={4}>
          {/* Team 1 Score */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3.5, 
              borderRadius: 2, 
              bgcolor: team1Colors.bgColor,
              border: `2px solid ${team1Colors.borderColor}`,
              backdropFilter: 'blur(10px)',
              background: `linear-gradient(135deg, ${team1Colors.bgColor} 0%, ${hexToRgba(team1Colors.primary, 0.15)} 100%)`,
              boxShadow: `0 4px 12px ${hexToRgba(team1Colors.primary, 0.25)}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Avatar 
                  src={match.team1?.logo} 
                  alt={match.team1?.shortName || match.team1?.name}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    bgcolor: team1Colors.primary,
                    border: `2px solid ${team1Colors.accent || team1Colors.primary}`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem'
                  }}
                >
                  {(match.team1?.shortName || match.team1?.name || 'T1').charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 0.5, color: 'white' }}>
                    {match.team1?.shortName || match.team1?.name || 'Team 1'}
                  </Typography>
                  {match.innings?.[0] && (
                    <Chip 
                      label="Batting" 
                      size="small"
                      sx={{
                        bgcolor: team1Colors.accent || team1Colors.primary,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                        border: `1px solid ${team1Colors.accent || team1Colors.primary}`
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, color: 'white' }}>
                  {match.innings?.[0]?.totalRuns || 0}/{match.innings?.[0]?.totalWickets || 0}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500, fontSize: { xs: '1rem', md: '1.125rem' }, color: 'white' }}>
                  ({match.innings?.[0]?.totalOvers || '0.0'} ov)
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Team 2 Score */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3.5, 
              borderRadius: 2, 
              bgcolor: team2Colors.bgColor,
              border: `2px solid ${team2Colors.borderColor}`,
              backdropFilter: 'blur(10px)',
              background: `linear-gradient(135deg, ${team2Colors.bgColor} 0%, ${hexToRgba(team2Colors.primary, 0.15)} 100%)`,
              boxShadow: `0 4px 12px ${hexToRgba(team2Colors.primary, 0.25)}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Avatar 
                  src={match.team2?.logo} 
                  alt={match.team2?.shortName || match.team2?.name}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    bgcolor: team2Colors.primary,
                    border: `2px solid ${team2Colors.accent || team2Colors.primary}`,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem'
                  }}
                >
                  {(match.team2?.shortName || match.team2?.name || 'T2').charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 0.5, color: 'white' }}>
                    {match.team2?.shortName || match.team2?.name || 'Team 2'}
                  </Typography>
                  {match.innings?.[1] && (
                    <Chip 
                      label="Batting" 
                      size="small"
                      sx={{
                        bgcolor: team2Colors.accent || team2Colors.primary,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                        border: `1px solid ${team2Colors.accent || team2Colors.primary}`
                      }}
                    />
                  )}
                </Box>
              </Box>
              {match.innings?.[1] ? (
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, color: 'white' }}>
                    {match.innings[1].totalRuns}/{match.innings[1].totalWickets}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 500, fontSize: { xs: '1rem', md: '1.125rem' }, color: 'white' }}>
                    ({match.innings[1].totalOvers} ov)
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 600, fontSize: { xs: '1.125rem', md: '1.25rem' }, color: 'white' }}>
                  Yet to bat
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Match Info */}
        {match.tossWinner && (
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SportsCricketIcon sx={{ fontSize: 20, opacity: 0.9 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.9375rem', opacity: 0.95 }}>
              {match.tossWinner?.shortName || match.tossWinner?.name || 'Team'} won the toss and chose to {match.tossDecision || 'bat'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Scorecard" />
          <Tab label="Commentary" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>

      {/* Scorecard Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Batting Scorecard */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {match.innings?.[0]?.battingTeam?.shortName || match.innings?.[0]?.battingTeam?.name || 
                 (match.innings?.[0]?.battingTeamId === match.team1Id ? (match.team1?.shortName || match.team1?.name) : (match.team2?.shortName || match.team2?.name)) || 
                 'Team'} Innings - {match.innings?.[0]?.totalRuns || 0}/{match.innings?.[0]?.totalWickets || 0} ({match.innings?.[0]?.totalOvers || '0.0'} ov)
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
                      <TableRow key={index} sx={{ bgcolor: !stat.isOut ? 'success.lighter' : 'inherit' }}>
                        <TableCell>
                          <Box>
                            <Typography fontWeight={!stat.isOut ? 'bold' : 'normal'}>
                              {stat.player?.name} {!stat.isOut && '⭐'}
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
                <strong>Extras:</strong> {match.innings?.[0]?.extras || 0}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                <strong>Total:</strong> {match.innings?.[0]?.totalRuns || 0}/{match.innings?.[0]?.totalWickets || 0} ({match.innings?.[0]?.totalOvers || '0.0'} ov)
              </Typography>
            </Box>
          </Paper>

          {/* Bowling Scorecard */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: 'secondary.main', color: 'white', p: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {match.innings?.[0]?.bowlingTeam?.shortName || match.innings?.[0]?.bowlingTeam?.name || 
                 (match.innings?.[0]?.bowlingTeamId === match.team2Id ? (match.team2?.shortName || match.team2?.name) : (match.team1?.shortName || match.team1?.name)) || 
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
          <Card sx={{ mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="h6" fontWeight="bold">
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
          <Card>
            <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="h6" fontWeight="bold">
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
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Live Commentary
          </Typography>
          <Divider sx={{ mb: 2 }} />
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
        </Paper>
      )}

      {/* Statistics Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Match Statistics
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Runs</Typography>
                    <Typography variant="h5" fontWeight="bold">{match.innings?.[0]?.totalRuns || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Wickets</Typography>
                    <Typography variant="h5" fontWeight="bold">{match.innings?.[0]?.totalWickets || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Run Rate</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {match.innings?.[0]?.runRate || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Extras</Typography>
                    <Typography variant="h5" fontWeight="bold">{match.innings?.[0]?.extras || 0}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                <Typography variant="h6" fontWeight="bold">
                  Scoring Breakdown
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {(() => {
                  // Calculate runs from boundaries (4s and 6s)
                  const totalFours = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.fours || 0), 0) || 0;
                  const totalSixes = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.sixes || 0), 0) || 0;
                  const boundaryRuns = (totalFours * 4) + (totalSixes * 6);
                  const totalRuns = match.innings?.[0]?.totalRuns || 0;
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
    </Container>
  );
};

export default MatchDetails;
