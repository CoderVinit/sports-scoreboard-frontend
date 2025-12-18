import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

const ScoreDisplay = ({ scoreData }) => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current score
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {scoreData.runs}/{scoreData.wickets}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {scoreData.overs} overs
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Last 5 balls
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {scoreData.balls.map((ball, index) => {
              const displayText = ball.isWicket 
                ? (ball.runs === 0 ? 'W' : `${ball.runs}W`) 
                : ball.runs;
              const chipColor = ball.isWicket 
                ? 'error' 
                : (ball.runs === 6 ? 'error' : ball.runs === 4 ? 'primary' : 'default');
              
              return (
                <Chip
                  key={index}
                  label={displayText}
                  color={chipColor}
                  size="small"
                />
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ScoreDisplay;
