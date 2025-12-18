import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import AdminLayout from '../../components/admin/AdminLayout';
import CricketLoader from '../../components/CricketLoader';
import { ScoreEntryNotifications, ScoreEntryContent } from '../../components/admin/scoreEntry';
import useScoreEntry from './hooks/useScoreEntry';

const AdminScoreEntryStatic = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const {
    match,
    players,
    statistics,
    loading,
    submitting,
    error,
    successMessage,
    currentBall,
    scoreData,
    setCurrentBall,
    clearError,
    clearSuccess,
    handleBallSubmit,
    handleStartSecondInnings,
  } = useScoreEntry(matchId);

  if (loading) {
    return (
      <AdminLayout title="Score Entry" subtitle="Record ball-by-ball updates for the selected match.">
        <CricketLoader />
      </AdminLayout>
    );
  }

  if (!match) {
    return (
      <AdminLayout title="Score Entry" subtitle="Record ball-by-ball updates for the selected match.">
        <Typography color="error" variant="h6">Match not found</Typography>
      </AdminLayout>
    );
  }

  const team1Name = match.team1?.name || match.Team1?.name || 'Team 1';
  const team2Name = match.team2?.name || match.Team2?.name || 'Team 2';

  return (
    <AdminLayout
      title="Score Entry"
      subtitle={`Recording for match #${match.id} - ${team1Name} vs ${team2Name}`}
    >
      <ScoreEntryNotifications
        successMessage={successMessage}
        error={error}
        onClearSuccess={clearSuccess}
        onClearError={clearError}
      />

      <ScoreEntryContent
        match={match}
        players={players}
        statistics={statistics}
        submitting={submitting}
        currentBall={currentBall}
        scoreData={scoreData}
        setCurrentBall={setCurrentBall}
        onBallSubmit={handleBallSubmit}
        onStartSecondInnings={handleStartSecondInnings}
        onBack={() => navigate('/admin/matches')}
      />
    </AdminLayout>
  );
};

export default AdminScoreEntryStatic;
