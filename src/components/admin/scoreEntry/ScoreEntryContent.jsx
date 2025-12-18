import { Box, Grid } from '@mui/material';
import {
  ScoreDisplay,
  BallEntryForm,
  CurrentBatsmenStats,
  CurrentBowlerStats,
  MatchInfoHeader,
  SecondInningsAlert
} from './index';

const ScoreEntryContent = ({
  match,
  players,
  statistics,
  submitting,
  currentBall,
  scoreData,
  setCurrentBall,
  onBallSubmit,
  onStartSecondInnings,
  onBack
}) => {
  return (
    <Box>
      <MatchInfoHeader 
        match={match} 
        onBack={onBack} 
      />

      <SecondInningsAlert 
        match={match}
        scoreData={scoreData}
        submitting={submitting}
        onStartSecondInnings={onStartSecondInnings}
      />

      <Grid container spacing={3}>
        {/* Score Display - Left Column */}
        <Grid item xs={12} md={4}>
          <ScoreDisplay scoreData={scoreData} />
        </Grid>

        {/* Ball Entry Form - Right Column */}
        <Grid item xs={12} md={8}>
          <BallEntryForm
            currentBall={currentBall}
            setCurrentBall={setCurrentBall}
            scoreData={scoreData}
            match={match}
            players={players}
            submitting={submitting}
            onSubmit={onBallSubmit}
          />
        </Grid>

        {/* Current Batsmen Stats */}
        <Grid item xs={12} md={6}>
          <CurrentBatsmenStats
            currentBall={currentBall}
            statistics={statistics}
            players={players}
          />
        </Grid>

        {/* Current Bowler Stats */}
        <Grid item xs={12} md={6}>
          <CurrentBowlerStats
            currentBall={currentBall}
            statistics={statistics}
            players={players}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScoreEntryContent;
