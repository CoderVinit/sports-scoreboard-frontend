import { useState, useEffect, useCallback } from 'react';
import { matchService, ballService, playerService, inningsService } from '../../../api/services';

const initialBallState = {
  runs: '',
  extras: 0,
  extraType: 'none',
  isWicket: false,
  batsmanId: '',
  nonStrikerId: '',
  bowlerId: '',
  dismissalType: '',
  fielderId: '',
  commentary: '',
};

const initialScoreState = {
  runs: 0,
  wickets: 0,
  overs: 0,
  currentOver: 0,
  currentBallInOver: 0,
  balls: []
};

export const useScoreEntry = (matchId) => {
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentBall, setCurrentBall] = useState(initialBallState);
  const [scoreData, setScoreData] = useState(initialScoreState);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage('');

  const loadMatchData = useCallback(async () => {
    try {
      setLoading(true);
      const [matchData, statsData, playersData] = await Promise.all([
        matchService.getMatchDetails(matchId),
        matchService.getMatchStatistics(matchId),
        playerService.getAllPlayers()
      ]);
      
      const matchInfo = matchData.data || matchData.match;
      setMatch(matchInfo);
      setStatistics(statsData.data || statsData);
      setPlayers(playersData.data || playersData.players || []);
      
      if (matchInfo) {
        const currentInnings = matchInfo.innings?.[matchInfo.currentInnings - 1];

        let recentBalls = [];
        if (currentInnings?.id) {
          try {
            const ballsData = await ballService.getRecentBalls(currentInnings.id, 5);
            recentBalls = (ballsData.data || ballsData.balls || []).map(ball => ({
              runs: (ball.runs || 0) + (ball.extras || 0),
              isWicket: ball.isWicket
            }));
          } catch {
            console.log('No balls recorded yet');
          }
        }

        setScoreData({
          runs: currentInnings?.totalRuns || 0,
          wickets: currentInnings?.totalWickets || 0,
          overs: parseFloat(currentInnings?.totalOvers || 0),
          currentOver: Math.floor(parseFloat(currentInnings?.totalOvers || 0)),
          currentBallInOver: Math.round((parseFloat(currentInnings?.totalOvers || 0) % 1) * 10),
          balls: recentBalls
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load match data');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadMatchData();
  }, [loadMatchData]);

  const validateBallSubmit = () => {
    if (!currentBall.batsmanId || !currentBall.bowlerId) {
      setError('Please select batsman and bowler');
      return false;
    }
    
    if (!currentBall.nonStrikerId) {
      setError('Please select non-striker batsman');
      return false;
    }

    if (currentBall.batsmanId === currentBall.nonStrikerId) {
      setError('Striker and non-striker cannot be the same player');
      return false;
    }

    return true;
  };

  const handleBallSubmit = async () => {
    if (!validateBallSubmit()) return;

    try {
      setSubmitting(true);
      
      const currentInnings = match.innings?.[match.currentInnings - 1];
      if (!currentInnings || !currentInnings.id) {
        setError('No active innings found. Please start an innings first.');
        setSubmitting(false);
        return;
      }
      
      const ballData = {
        matchId: parseInt(matchId),
        inningsId: currentInnings.id,
        overNumber: scoreData.currentOver,
        ballNumber: scoreData.currentBallInOver + 1,
        batsmanId: parseInt(currentBall.batsmanId),
        nonStrikerId: parseInt(currentBall.nonStrikerId),
        bowlerId: parseInt(currentBall.bowlerId),
        runs: parseInt(currentBall.runs) || 0,
        extras: parseInt(currentBall.extras) || 0,
        extraType: currentBall.extraType !== 'none' ? currentBall.extraType : null,
        isWicket: currentBall.isWicket,
        wicketType: currentBall.isWicket ? currentBall.dismissalType : null,
        dismissedPlayerId: currentBall.isWicket ? parseInt(currentBall.batsmanId) : null,
        fielderId: currentBall.fielderId ? parseInt(currentBall.fielderId) : null,
        commentary: currentBall.commentary || null,
      };

      await ballService.createBall(ballData);

      const runs = parseInt(currentBall.runs) || 0;
      const extras = parseInt(currentBall.extras) || 0;
      const totalRunsForBall = runs + extras;
      
      const isValidDelivery = currentBall.extraType !== 'wide' && currentBall.extraType !== 'no_ball';
      const newBallInOver = isValidDelivery ? (scoreData.currentBallInOver + 1) % 6 : scoreData.currentBallInOver;
      const newOver = scoreData.currentOver + (newBallInOver === 0 && isValidDelivery ? 1 : 0);
      const newOvers = newOver + (newBallInOver / 10);

      const ballsData = await ballService.getRecentBalls(currentInnings.id, 5);
      const recentBalls = (ballsData.data || ballsData.balls || []).map(ball => ({
        runs: (ball.runs || 0) + (ball.extras || 0),
        isWicket: ball.isWicket
      }));

      setScoreData(prev => ({
        ...prev,
        runs: prev.runs + totalRunsForBall,
        wickets: prev.wickets + (currentBall.isWicket ? 1 : 0),
        currentOver: newOver,
        currentBallInOver: newBallInOver,
        overs: parseFloat(newOvers.toFixed(1)),
        balls: recentBalls
      }));

      const shouldSwapBatsmen = runs % 2 === 1;
      const newStrikerId = shouldSwapBatsmen ? currentBall.nonStrikerId : currentBall.batsmanId;
      const newNonStrikerId = shouldSwapBatsmen ? currentBall.batsmanId : currentBall.nonStrikerId;

      setCurrentBall({
        ...initialBallState,
        batsmanId: currentBall.isWicket ? '' : newStrikerId,
        nonStrikerId: currentBall.isWicket ? '' : newNonStrikerId,
        bowlerId: currentBall.bowlerId,
      });

      const statsData = await matchService.getMatchStatistics(matchId);
      setStatistics(statsData.data || statsData);

      setSuccessMessage(`Ball recorded: ${runs} run(s) - Over ${newOver}.${newBallInOver + 1}`);
    } catch (err) {
      console.error('Error submitting ball:', err);
      setError(err.message || 'Failed to record ball');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartSecondInnings = async () => {
    if (!match) return;

    try {
      setSubmitting(true);

      const firstInnings = match.innings?.find((inn) => inn.inningsNumber === 1);
      if (!firstInnings) {
        setError('First innings data not found');
        return;
      }

      const battingFirstId = match.battingFirstId || match.team1Id;
      const secondBattingTeamId = battingFirstId === match.team1Id ? match.team2Id : match.team1Id;
      const secondBowlingTeamId = battingFirstId;

      const target = (firstInnings.totalRuns || 0) + 1;
      const totalOversPerSide = match.totalOvers || firstInnings.totalOvers || 0;
      const requiredRunRate = totalOversPerSide > 0 ? target / totalOversPerSide : null;

      await inningsService.updateInnings(firstInnings.id, {
        status: 'completed',
        target,
      });

      await inningsService.createInnings({
        matchId: match.id,
        battingTeamId: secondBattingTeamId,
        bowlingTeamId: secondBowlingTeamId,
        inningsNumber: 2,
        status: 'in_progress',
        target,
        requiredRunRate,
      });

      await matchService.updateMatch(match.id, { currentInnings: 2 });

      await loadMatchData();
      setSuccessMessage('Second innings started');
    } catch (err) {
      console.error('Error starting second innings:', err);
      setError(err.message || 'Failed to start second innings');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // State
    match,
    players,
    statistics,
    loading,
    submitting,
    error,
    successMessage,
    currentBall,
    scoreData,
    
    // Setters
    setCurrentBall,
    clearError,
    clearSuccess,
    
    // Actions
    handleBallSubmit,
    handleStartSecondInnings,
    loadMatchData,
  };
};

export default useScoreEntry;
