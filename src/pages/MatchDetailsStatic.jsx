import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import { matchService, playerService } from '../api/services';
import { getSocket } from '../utils/socket';
import CricketLoader from '../components/CricketLoader';
import {
  MatchHeader,
  MatchTabs,
  BattingScorecard,
  BowlingScorecard,
  FallOfWickets,
  Partnerships,
  CommentaryTab,
  StatisticsTab,
  SquadsTab,
} from '../components/match';

const MatchDetails = () => {
  const { matchId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [match, setMatch] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [firstInningsStats, setFirstInningsStats] = useState(null);
  const [commentary, setCommentary] = useState([]);
  
  // Collapsible section states
  const [battingOpen, setBattingOpen] = useState(true);
  const [bowlingOpen, setBowlingOpen] = useState(true);
  const [firstInningsBattingOpen, setFirstInningsBattingOpen] = useState(true);
  const [firstInningsBowlingOpen, setFirstInningsBowlingOpen] = useState(true);
  const [fallOfWicketsOpen, setFallOfWicketsOpen] = useState(true);
  const [partnershipsOpen, setPartnershipsOpen] = useState(true);
  const [matchStatsOpen, setMatchStatsOpen] = useState(true);
  const [scoringBreakdownOpen, setScoringBreakdownOpen] = useState(true);
  const [team1SquadOpen, setTeam1SquadOpen] = useState(true);
  const [team2SquadOpen, setTeam2SquadOpen] = useState(true);
  
  // Squad data
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
        
        const matchInfo = matchData.data || matchData.match;
        const stats = statsData.data || statsData;
        
        setMatch(matchInfo);
        setStatistics(stats);
        setCommentary(commentaryData.data || commentaryData.commentary || []);
        
        // Fetch first innings statistics if second innings exists
        const innings = matchInfo?.innings || [];
        const firstInnings = innings.find(inn => inn.inningsNumber === 1);
        const secondInnings = innings.find(inn => inn.inningsNumber === 2);
        
        if (firstInnings && secondInnings) {
          try {
            const firstInningsStatsData = await matchService.getInningsStatistics(matchId, firstInnings.id);
            setFirstInningsStats(firstInningsStatsData.data || firstInningsStatsData);
          } catch (error) {
            console.error('Error fetching first innings stats:', error);
          }
        }
        
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
        try {
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
          
          // Update first innings statistics if second innings exists
          const innings = matchInfo?.innings || [];
          const firstInnings = innings.find(inn => inn.inningsNumber === 1);
          const secondInnings = innings.find(inn => inn.inningsNumber === 2);
          
          if (firstInnings && secondInnings) {
            try {
              const firstInningsStatsData = await matchService.getInningsStatistics(matchId, firstInnings.id);
              setFirstInningsStats(firstInningsStatsData.data || firstInningsStatsData);
            } catch (error) {
              console.error('Error fetching first innings stats:', error);
            }
          }
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
    return <CricketLoader />;
  }

  if (!match) {
    return <Container><Typography>Match not found</Typography></Container>;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Helper to get team by ID
  const getTeamById = (teamId) => {
    if (!teamId) return null;
    if (teamId === match.team1Id) return match.team1;
    if (teamId === match.team2Id) return match.team2;
    return null;
  };

  // Derive innings information
  const inningsList = match.innings || [];
  const firstInnings = inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
  const secondInnings = inningsList.find((inn) => inn.inningsNumber === 2) || null;
  const currentInningsNumber = match.currentInnings || (secondInnings ? 2 : 1);
  const currentInnings = inningsList.find((inn) => inn.inningsNumber === currentInningsNumber) || secondInnings || firstInnings;

  const firstInningsBattingTeam = firstInnings ? firstInnings.battingTeam || getTeamById(firstInnings.battingTeamId) : null;
  const secondInningsBattingTeam = secondInnings ? secondInnings.battingTeam || getTeamById(secondInnings.battingTeamId) : null;

  // Result text when match is finished
  const winnerTeam = match.winner || getTeamById(match.winnerId);
  let resultText = '';

  if (match.status === 'completed' || (firstInnings && secondInnings)) {
    if (match.resultType === 'tie') {
      resultText = 'Match tied';
    } else if (match.resultType === 'no_result') {
      resultText = 'No result';
    } else if (firstInnings && secondInnings) {
      const battedFirstTeam = firstInningsBattingTeam || getTeamById(firstInnings.battingTeamId);
      const battedSecondTeam = secondInningsBattingTeam || getTeamById(secondInnings.battingTeamId);
      
      const firstInningsRuns = firstInnings.totalRuns || 0;
      const secondInningsRuns = secondInnings.totalRuns || 0;
      const secondInningsWickets = secondInnings.totalWickets || 0;
      
      if (secondInningsRuns > firstInningsRuns) {
        const wicketsRemaining = 10 - secondInningsWickets;
        if (battedSecondTeam) {
          resultText = `${battedSecondTeam.shortName || battedSecondTeam.name} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? '' : 's'}`;
        }
      } else if (firstInningsRuns > secondInningsRuns) {
        const runMargin = firstInningsRuns - secondInningsRuns;
        if (battedFirstTeam) {
          resultText = `${battedFirstTeam.shortName || battedFirstTeam.name} won by ${runMargin} run${runMargin === 1 ? '' : 's'}`;
        }
      } else {
        resultText = 'Match tied';
      }
    } else if (winnerTeam && match.winMargin) {
      resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
    }
  }

  // Get bowling team name for current innings
  const getCurrentBowlingTeamName = () => {
    return currentInnings?.bowlingTeam?.shortName || currentInnings?.bowlingTeam?.name ||
      (currentInnings?.bowlingTeamId === match.team1Id
        ? (match.team1?.shortName || match.team1?.name)
        : (match.team2?.shortName || match.team2?.name)) ||
      'Team';
  };

  // Get first innings bowling team name
  const getFirstInningsBowlingTeamName = () => {
    return firstInnings?.bowlingTeamId === match.team1Id
      ? (match.team1?.shortName || match.team1?.name)
      : (match.team2?.shortName || match.team2?.name);
  };

  return (
    <Container maxWidth={false} sx={{ py: 0, px: 0 }}>
      {/* Match Header */}
      <MatchHeader
        match={match}
        firstInnings={firstInnings}
        secondInnings={secondInnings}
        firstInningsBattingTeam={firstInningsBattingTeam}
        secondInningsBattingTeam={secondInningsBattingTeam}
        currentInningsNumber={currentInningsNumber}
        resultText={resultText}
      />

      {/* Tabs */}
      <MatchTabs tabValue={tabValue} onTabChange={handleTabChange} />

      {/* Scorecard Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Current Innings Batting */}
          <BattingScorecard
            innings={currentInnings}
            battingStats={statistics?.battingStats}
            match={match}
            currentInnings={currentInnings}
            statistics={statistics}
            isOpen={battingOpen}
            onToggle={() => setBattingOpen(!battingOpen)}
            showStrikerHighlight={true}
          />

          {/* First Innings Full Details (when second innings active) */}
          {secondInnings && firstInnings && firstInningsStats && (
            <Box sx={{ mt: 4, mb: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#0d47a1' }}>
                  1st Innings - {firstInningsBattingTeam?.shortName || firstInningsBattingTeam?.name || 'Team'}
                </Typography>
              </Box>

              <BattingScorecard
                innings={firstInnings}
                battingStats={firstInningsStats?.battingStats}
                teamName={firstInningsBattingTeam?.shortName || firstInningsBattingTeam?.name}
                match={match}
                isOpen={firstInningsBattingOpen}
                onToggle={() => setFirstInningsBattingOpen(!firstInningsBattingOpen)}
              />

              <BowlingScorecard
                bowlingStats={firstInningsStats?.bowlingStats}
                teamName={getFirstInningsBowlingTeamName()}
                isOpen={firstInningsBowlingOpen}
                onToggle={() => setFirstInningsBowlingOpen(!firstInningsBowlingOpen)}
              />
            </Box>
          )}

          {/* Current Innings Bowling */}
          <BowlingScorecard
            bowlingStats={statistics?.bowlingStats}
            teamName={getCurrentBowlingTeamName()}
            isOpen={bowlingOpen}
            onToggle={() => setBowlingOpen(!bowlingOpen)}
          />

          {/* Fall of Wickets */}
          <FallOfWickets
            fallOfWickets={statistics?.fallOfWickets}
            isOpen={fallOfWicketsOpen}
            onToggle={() => setFallOfWicketsOpen(!fallOfWicketsOpen)}
          />

          {/* Partnerships */}
          <Partnerships
            partnerships={statistics?.partnerships}
            isOpen={partnershipsOpen}
            onToggle={() => setPartnershipsOpen(!partnershipsOpen)}
          />
        </Box>
      )}

      {/* Commentary Tab */}
      {tabValue === 1 && <CommentaryTab commentary={commentary} />}

      {/* Statistics Tab */}
      {tabValue === 2 && (
        <StatisticsTab
          currentInnings={currentInnings}
          statistics={statistics}
          matchStatsOpen={matchStatsOpen}
          onMatchStatsToggle={() => setMatchStatsOpen(!matchStatsOpen)}
          scoringBreakdownOpen={scoringBreakdownOpen}
          onScoringBreakdownToggle={() => setScoringBreakdownOpen(!scoringBreakdownOpen)}
        />
      )}

      {/* Squads Tab */}
      {tabValue === 3 && (
        <SquadsTab
          match={match}
          team1Squad={team1Squad}
          team2Squad={team2Squad}
          team1SquadOpen={team1SquadOpen}
          team2SquadOpen={team2SquadOpen}
          onTeam1Toggle={() => setTeam1SquadOpen(!team1SquadOpen)}
          onTeam2Toggle={() => setTeam2SquadOpen(!team2SquadOpen)}
        />
      )}
    </Container>
  );
};

export default MatchDetails;
