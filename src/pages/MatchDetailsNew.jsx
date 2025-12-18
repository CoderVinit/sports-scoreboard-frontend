import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { matchService, playerService } from '../api/services';
import { getSocket } from '../utils/socket';
import CricketLoader from '../components/CricketLoader';
import {
  MatchHeaderNew,
  BattingScorecardNew,
  BowlingScorecardNew,
  FallOfWicketsNew,
  CommentaryNew,
  MatchSidebar,
  InningsTabs,
} from '../components/match';

const MatchDetailsNew = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [firstInningsStats, setFirstInningsStats] = useState(null);
  const [secondInningsStats, setSecondInningsStats] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [selectedInningsId, setSelectedInningsId] = useState(null);
  const [team1Squad, setTeam1Squad] = useState([]);
  const [team2Squad, setTeam2Squad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SCORECARD');

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        const [matchData, statsData, commentaryData] = await Promise.all([
          matchService.getMatchDetails(matchId),
          matchService.getMatchStatistics(matchId),
          matchService.getMatchCommentary(matchId)
        ]);
        
        const matchInfo = matchData.data || matchData.match;
        const stats = statsData.data || statsData;
        
        setMatch(matchInfo);
        setStatistics(stats);
        setCommentary(commentaryData.data || commentaryData.commentary || []);
        
        // Set default selected innings
        const innings = matchInfo?.innings || [];
        if (innings.length > 0) {
          const currentInnings = innings.find(inn => inn.status === 'in_progress') || innings[innings.length - 1];
          setSelectedInningsId(currentInnings?.id);
        }
        
        // Fetch innings-specific statistics for all innings
        const firstInnings = innings.find(inn => inn.inningsNumber === 1);
        const secondInnings = innings.find(inn => inn.inningsNumber === 2);
        
        // Always fetch first innings stats if it exists
        if (firstInnings) {
          try {
            const firstInningsStatsData = await matchService.getInningsStatistics(matchId, firstInnings.id);
            setFirstInningsStats(firstInningsStatsData.data || firstInningsStatsData);
          } catch (error) {
            console.error('Error fetching first innings stats:', error);
          }
        }
        
        // Fetch second innings stats if it exists
        if (secondInnings) {
          try {
            const secondInningsStatsData = await matchService.getInningsStatistics(matchId, secondInnings.id);
            setSecondInningsStats(secondInningsStatsData.data || secondInningsStatsData);
          } catch (error) {
            console.error('Error fetching second innings stats:', error);
          }
        }
        
        // Fetch squads
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
    
    socket.on('ballRecorded', async () => {
      const [matchData, statsData, commentaryData] = await Promise.all([
        matchService.getMatchDetails(matchId),
        matchService.getMatchStatistics(matchId),
        matchService.getMatchCommentary(matchId)
      ]);
      
      const matchInfo = matchData.data || matchData.match;
      setMatch(matchInfo);
      setStatistics(statsData.data || statsData);
      setCommentary(commentaryData.data || commentaryData.commentary || []);
      
      // Re-fetch innings stats on ball update
      const innings = matchInfo?.innings || [];
      const firstInnings = innings.find(inn => inn.inningsNumber === 1);
      const secondInnings = innings.find(inn => inn.inningsNumber === 2);
      
      if (firstInnings) {
        try {
          const firstInningsStatsData = await matchService.getInningsStatistics(matchId, firstInnings.id);
          setFirstInningsStats(firstInningsStatsData.data || firstInningsStatsData);
        } catch (error) {
          console.error('Error fetching first innings stats:', error);
        }
      }
      
      if (secondInnings) {
        try {
          const secondInningsStatsData = await matchService.getInningsStatistics(matchId, secondInnings.id);
          setSecondInningsStats(secondInningsStatsData.data || secondInningsStatsData);
        } catch (error) {
          console.error('Error fetching second innings stats:', error);
        }
      }
    });

    return () => {
      socket.off('ballRecorded');
    };
  }, [matchId]);

  if (loading) {
    return <CricketLoader />;
  }

  if (!match) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="error">Match not found</Typography>
      </Box>
    );
  }

  // Extract data
  const innings = match.innings || [];
  const firstInnings = innings.find(inn => inn.inningsNumber === 1);
  const secondInnings = innings.find(inn => inn.inningsNumber === 2);
  const currentInnings = innings.find(inn => inn.id === selectedInningsId) || firstInnings;
  
  const team1 = match.team1 || match.Team1;
  const team2 = match.team2 || match.Team2;
  
  // Determine batting teams
  const firstInningsBattingTeam = firstInnings?.battingTeamId === team1?.id ? team1 : team2;
  const secondInningsBattingTeam = secondInnings?.battingTeamId === team1?.id ? team1 : team2;
  const currentBattingTeam = currentInnings?.battingTeamId === team1?.id ? team1 : team2;
  const currentBowlingTeam = currentInnings?.battingTeamId === team1?.id ? team2 : team1;

  // Get stats for selected innings - use innings-specific stats
  const isFirstInningsSelected = currentInnings?.inningsNumber === 1;
  const currentStats = isFirstInningsSelected 
    ? (firstInningsStats || statistics)
    : (secondInningsStats || statistics);

  // Use battingStats and bowlingStats from the API response if available
  // Otherwise fall back to filtering playerStats
  const battingStats = currentStats?.battingStats || currentStats?.playerStats?.filter(stat => 
    stat.ballsFaced > 0 || stat.runsScored > 0
  ) || [];
  
  const bowlingStats = currentStats?.bowlingStats || currentStats?.playerStats?.filter(stat => 
    stat.oversBowled > 0 || stat.wicketsTaken > 0
  ) || [];

  // Result text
  const resultText = match.status === 'completed' 
    ? match.result || `${match.winner?.name || 'Team'} won` 
    : null;

  // Filter commentary for the selected innings
  const filteredCommentary = commentary.filter(c => {
    const targetInningsNumber = isFirstInningsSelected ? 1 : 2;
    // Check by inningsNumber (most reliable) or by inningsId
    return c.inningsNumber === targetInningsNumber || 
           (selectedInningsId && String(c.inningsId) === String(selectedInningsId));
  });

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <MatchHeaderNew
        match={match}
        firstInnings={firstInnings}
        secondInnings={secondInnings}
        firstInningsBattingTeam={firstInningsBattingTeam}
        secondInningsBattingTeam={secondInningsBattingTeam}
        currentInningsNumber={match.currentInnings}
        resultText={resultText}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Main Scorecard Column */}
          <Grid item xs={12} lg={8}>
            {/* INFO Tab */}
            {activeTab === 'INFO' && (
              <Paper elevation={0} sx={{ 
                bgcolor: 'white', 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>ℹ️</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      Match Information
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {/* Match Details */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: '#f8fafc', borderRadius: '12px', p: 2.5, border: '1px solid #e2e8f0' }}>
                        <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>🏏</span> Match Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Match</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {team1?.name} vs {team2?.name}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Format</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.matchFormat || match?.matchType || 'T20'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Venue</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.venue || 'TBD'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Series</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.series || 'Friendly Match'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Date & Time */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: '#f8fafc', borderRadius: '12px', p: 2.5, border: '1px solid #e2e8f0' }}>
                        <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>📅</span> Date & Time
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Date</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.matchDate ? new Date(match.matchDate).toLocaleDateString('en-US', { 
                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
                              }) : 'TBD'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Time</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.matchTime || 'TBD'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Status</Typography>
                            <Box sx={{ 
                              px: 1.5, 
                              py: 0.25, 
                              borderRadius: '6px',
                              bgcolor: match?.status === 'live' ? '#fef2f2' : match?.status === 'completed' ? '#f0fdf4' : '#f1f5f9'
                            }}>
                              <Typography sx={{ 
                                color: match?.status === 'live' ? '#dc2626' : match?.status === 'completed' ? '#16a34a' : '#64748b', 
                                fontSize: '0.8rem', 
                                fontWeight: 600,
                                textTransform: 'capitalize'
                              }}>
                                {match?.status || 'Upcoming'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Toss Details */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: '#f8fafc', borderRadius: '12px', p: 2.5, border: '1px solid #e2e8f0' }}>
                        <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>🪙</span> Toss Details
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Toss Winner</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.tossWinner?.name || firstInningsBattingTeam?.name || 'TBD'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Decision</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
                              Elected to {match?.tossDecision || 'bat'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Umpires & Officials */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: '#f8fafc', borderRadius: '12px', p: 2.5, border: '1px solid #e2e8f0' }}>
                        <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '0.9rem', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>👨‍⚖️</span> Match Officials
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Umpire 1</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.umpire1 || 'TBD'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Umpire 2</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.umpire2 || 'TBD'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Match Referee</Typography>
                            <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 600 }}>
                              {match?.referee || 'TBD'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Result Banner */}
                  {match?.status === 'completed' && resultText && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 2.5, 
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                      borderRadius: '12px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5
                    }}>
                      <Typography sx={{ fontSize: '1.25rem' }}>🏆</Typography>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                        {resultText}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}

            {/* LIVE Tab */}
            {activeTab === 'LIVE' && (
              <Paper elevation={0} sx={{ 
                bgcolor: 'white', 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <CommentaryNew commentary={commentary} />
                </Box>
              </Paper>
            )}

            {/* SCORECARD Tab */}
            {activeTab === 'SCORECARD' && (
              <>
                <Paper elevation={0} sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    {/* Innings Tabs */}
                    {innings.length > 0 && (
                      <InningsTabs
                        innings={innings}
                        selectedInnings={selectedInningsId}
                        onSelectInnings={setSelectedInningsId}
                        team1={team1}
                        team2={team2}
                      />
                    )}

                    {/* Batting Scorecard */}
                    <BattingScorecardNew
                      battingStats={battingStats}
                      teamName={currentBattingTeam?.name || 'Batting Team'}
                      innings={currentInnings}
                      currentBatsmanId={statistics?.currentBatsmanId}
                      inningsLabel={isFirstInningsSelected ? '1st Innings' : '2nd Innings'}
                    />

                    {/* Fall of Wickets */}
                    <FallOfWicketsNew
                      fallOfWickets={currentStats?.fallOfWickets || currentInnings?.fallOfWickets || []}
                    />

                    {/* Bowling Scorecard */}
                    <BowlingScorecardNew
                      bowlingStats={bowlingStats}
                      teamName={currentBowlingTeam?.name || 'Bowling Team'}
                    />
                  </Box>
                </Paper>

                {/* Commentary Section */}
                <Paper elevation={0} sx={{ 
                  bgcolor: 'white', 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0',
                  mt: 3,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <CommentaryNew commentary={filteredCommentary} />
                  </Box>
                </Paper>
              </>
            )}

            {/* SQUADS Tab */}
            {activeTab === 'SQUADS' && (
              <Paper elevation={0} sx={{ 
                bgcolor: 'white', 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>👥</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      Team Squads
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {/* Team 1 Squad */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: '#f8fafc', borderRadius: '12px', p: 2.5, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, pb: 2, borderBottom: '2px solid #3b82f6' }}>
                          <Box sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.7rem' }}>
                              {(team1?.shortName || team1?.name || 'T1').substring(0, 3).toUpperCase()}
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                            {team1?.name || 'Team 1'}
                          </Typography>
                        </Box>
                        {team1Squad.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {team1Squad.map((player, idx) => (
                              <Box key={player.id || idx} sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2, 
                                py: 1.25,
                                borderBottom: idx !== team1Squad.length - 1 ? '1px solid #e2e8f0' : 'none',
                                transition: 'background-color 0.2s',
                                borderRadius: '6px',
                                mx: -1,
                                px: 1,
                                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.05)' }
                              }}>
                                <Box sx={{ 
                                  width: 28, 
                                  height: 28, 
                                  borderRadius: '8px', 
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center' 
                                }}>
                                  <Typography sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                                    {idx + 1}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {player.name}
                                  </Typography>
                                  {player.role && (
                                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                                      {player.role}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🏏</Typography>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                              Squad not announced yet
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Team 2 Squad */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 2.5, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                          <Box sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '10px', 
                            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.7rem' }}>
                              {(team2?.shortName || team2?.name || 'T2').substring(0, 3).toUpperCase()}
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1rem' }}>
                            {team2?.name || 'Team 2'}
                          </Typography>
                        </Box>
                        {team2Squad.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {team2Squad.map((player, idx) => (
                              <Box key={player.id || idx} sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2, 
                                py: 1.25,
                                borderBottom: idx !== team2Squad.length - 1 ? '1px solid #e2e8f0' : 'none',
                                transition: 'background-color 0.2s',
                                borderRadius: '6px',
                                mx: -1,
                                px: 1,
                                '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.05)' }
                              }}>
                                <Box sx={{ 
                                  width: 28, 
                                  height: 28, 
                                  borderRadius: '8px', 
                                  background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center' 
                                }}>
                                  <Typography sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                                    {idx + 1}
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {player.name}
                                  </Typography>
                                  {player.role && (
                                    <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'capitalize' }}>
                                      {player.role}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography sx={{ fontSize: '2rem', mb: 1 }}>🏏</Typography>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                              Squad not announced yet
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            )}

            {/* STATS Tab */}
            {activeTab === 'STATS' && (
              <Paper elevation={0} sx={{ 
                bgcolor: 'white', 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                minHeight: 'calc(100vh - 300px)'
              }}>
                {/* Header */}
                <Box sx={{ 
                  p: 2.5, 
                  background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <Typography sx={{ fontSize: '1.25rem' }}>📊</Typography>
                  <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
                    Match Statistics
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Top Run Scorers */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ 
                          p: 2,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Typography sx={{ fontSize: '1rem' }}>🏏</Typography>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                            Top Run Scorers
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                        {battingStats.length > 0 ? (
                          [...battingStats]
                            .sort((a, b) => (b.runsScored || 0) - (a.runsScored || 0))
                            .slice(0, 5)
                            .map((stat, idx) => (
                              <Box key={idx} sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                py: 1.5, 
                                borderBottom: idx !== 4 ? '1px solid #e2e8f0' : 'none'
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Box sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: '8px',
                                    background: idx === 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Typography sx={{ 
                                      color: idx === 0 ? 'white' : '#64748b', 
                                      fontWeight: 700, 
                                      fontSize: '0.7rem'
                                    }}>
                                      {idx + 1}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {stat.player?.name || stat.playerName || 'Player'}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography sx={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 700 }}>
                                    {stat.runsScored || 0}
                                  </Typography>
                                  <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                    ({stat.ballsFaced || 0} balls)
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography sx={{ fontSize: '1.5rem', mb: 1 }}>🏏</Typography>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                              No batting data yet
                            </Typography>
                          </Box>
                        )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Top Wicket Takers */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ bgcolor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ 
                          p: 2,
                          background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Typography sx={{ fontSize: '1rem' }}>🎳</Typography>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                            Top Wicket Takers
                          </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                        {bowlingStats.length > 0 ? (
                          [...bowlingStats]
                            .sort((a, b) => (b.wicketsTaken || 0) - (a.wicketsTaken || 0))
                            .slice(0, 5)
                            .map((stat, idx) => (
                              <Box key={idx} sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                py: 1.5, 
                                borderBottom: idx !== 4 ? '1px solid #e2e8f0' : 'none'
                              }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Box sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: '8px',
                                    background: idx === 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Typography sx={{ 
                                      color: idx === 0 ? 'white' : '#64748b', 
                                      fontWeight: 700, 
                                      fontSize: '0.7rem'
                                    }}>
                                      {idx + 1}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ color: '#1e293b', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {stat.player?.name || stat.playerName || 'Player'}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography sx={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 700 }}>
                                    {stat.wicketsTaken || 0}/{stat.runsConceded || 0}
                                  </Typography>
                                  <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                                    ({stat.oversBowled || 0} overs)
                                  </Typography>
                                </Box>
                              </Box>
                            ))
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography sx={{ fontSize: '1.5rem', mb: 1 }}>🎳</Typography>
                            <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                              No bowling data yet
                            </Typography>
                          </Box>
                        )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Match Summary Stats */}
                    <Grid item xs={12}>
                      <Box sx={{ bgcolor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <Box sx={{ 
                          p: 2,
                          background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Typography sx={{ fontSize: '1rem' }}>📈</Typography>
                          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                            Match Summary
                          </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 2, 
                                px: 2,
                                bgcolor: 'rgba(59, 130, 246, 0.08)',
                                borderRadius: '12px',
                                border: '1px solid rgba(59, 130, 246, 0.15)'
                              }}>
                                <Typography sx={{ color: '#3b82f6', fontSize: '1.75rem', fontWeight: 800 }}>
                                  {(firstInnings?.totalRuns || 0) + (secondInnings?.totalRuns || 0)}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                                  Total Runs
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 2, 
                                px: 2,
                                bgcolor: 'rgba(239, 68, 68, 0.08)',
                                borderRadius: '12px',
                                border: '1px solid rgba(239, 68, 68, 0.15)'
                              }}>
                                <Typography sx={{ color: '#ef4444', fontSize: '1.75rem', fontWeight: 800 }}>
                                  {(firstInnings?.totalWickets || 0) + (secondInnings?.totalWickets || 0)}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                                  Total Wickets
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 2, 
                                px: 2,
                                bgcolor: 'rgba(34, 197, 94, 0.08)',
                                borderRadius: '12px',
                                border: '1px solid rgba(34, 197, 94, 0.15)'
                              }}>
                                <Typography sx={{ color: '#22c55e', fontSize: '1.75rem', fontWeight: 800 }}>
                                  {statistics?.totalFours || 0}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                                  Fours
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ 
                                textAlign: 'center', 
                                py: 2, 
                                px: 2,
                                bgcolor: 'rgba(168, 85, 247, 0.08)',
                                borderRadius: '12px',
                                border: '1px solid rgba(168, 85, 247, 0.15)'
                              }}>
                                <Typography sx={{ color: '#a855f7', fontSize: '1.75rem', fontWeight: 800 }}>
                                  {statistics?.totalSixes || 0}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                                  Sixes
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            )}

            {/* PHOTOS Tab */}
            {activeTab === 'PHOTOS' && (
              <Paper elevation={0} sx={{ 
                bgcolor: 'white', 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                minHeight: 'calc(100vh - 300px)'
              }}>
                <Box sx={{ 
                  p: 2.5, 
                  background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <Typography sx={{ fontSize: '1.25rem' }}>📷</Typography>
                  <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
                    Match Photos
                  </Typography>
                </Box>
                <Box sx={{ p: 4, textAlign: 'center', py: 10 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <Typography sx={{ fontSize: '2.5rem' }}>📸</Typography>
                  </Box>
                  <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                    No Photos Available
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Photos from this match will appear here
                  </Typography>
                </Box>
              </Paper>
            )}

            {/* NEWS Tab */}
            {activeTab === 'NEWS' && (
              <Paper elevation={0} sx={{ 
                bgcolor: 'white', 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                minHeight: 'calc(100vh - 300px)'
              }}>
                <Box sx={{ 
                  p: 2.5, 
                  background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <Typography sx={{ fontSize: '1.25rem' }}>📰</Typography>
                  <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>
                    Match News
                  </Typography>
                </Box>
                <Box sx={{ p: 4, textAlign: 'center', py: 10 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <Typography sx={{ fontSize: '2.5rem' }}>📝</Typography>
                  </Box>
                  <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                    No News Available
                  </Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    News and updates about this match will appear here
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <MatchSidebar
              match={match}
              currentInnings={currentInnings}
              statistics={statistics}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MatchDetailsNew;
