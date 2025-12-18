import { Paper, Typography, Box, Button } from '@mui/material';

const MatchInfoHeader = ({ match, onBack }) => {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={onBack}>
          ← Back to Matches
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Score Entry - Match {match.id}
        </Typography>
        <Typography variant="h6">
          {match.team1?.name || match.Team1?.name || 'Team 1'} vs {match.team2?.name || match.Team2?.name || 'Team 2'}
        </Typography>
        <Typography variant="body2">
          {match.venue} • {new Date(match.matchDate).toLocaleDateString()}
        </Typography>
      </Paper>
    </>
  );
};

export default MatchInfoHeader;
