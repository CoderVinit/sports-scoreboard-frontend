import { Box, Alert, Button } from '@mui/material';

const SecondInningsAlert = ({ match, scoreData, submitting, onStartSecondInnings }) => {
  const hasSecondInnings = match.innings?.some((inn) => inn.inningsNumber === 2);
  const inningsComplete = scoreData.overs >= (match.totalOvers || 0) || scoreData.wickets >= 10;
  const canStartSecondInnings = !hasSecondInnings && match.currentInnings === 1 && inningsComplete;

  if (!canStartSecondInnings) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        First innings complete. Start the second innings when ready.
      </Alert>
      <Button
        variant="contained"
        color="primary"
        onClick={onStartSecondInnings}
        disabled={submitting}
      >
        {submitting ? 'Starting second innings...' : 'Start Second Innings'}
      </Button>
    </Box>
  );
};

export default SecondInningsAlert;
