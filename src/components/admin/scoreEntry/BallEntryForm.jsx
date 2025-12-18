import { 
  Paper, Typography, Box, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Divider 
} from '@mui/material';

const BallEntryForm = ({ 
  currentBall, 
  setCurrentBall, 
  scoreData, 
  match, 
  players, 
  submitting, 
  onSubmit 
}) => {
  // Filter players by team for batting
  const getBattingTeamPlayers = () => {
    const currentInnings = match?.innings?.[match.currentInnings - 1];
    const battingTeamId = currentInnings?.battingTeamId || match?.battingFirstId || match?.team1Id;
    return players.filter(p => p.teamId === battingTeamId);
  };

  // Filter players by team for bowling
  const getBowlingTeamPlayers = () => {
    const currentInnings = match?.innings?.[match.currentInnings - 1];
    const battingTeamId = currentInnings?.battingTeamId || match?.battingFirstId || match?.team1Id;
    const bowlingTeamId = currentInnings?.bowlingTeamId || 
      (battingTeamId === match?.team1Id ? match?.team2Id : match?.team1Id);
    return players.filter(p => p.teamId === bowlingTeamId);
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Enter Ball Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Current Ball Indicator */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
        <Typography variant="subtitle2" color="text.secondary">
          Next ball
        </Typography>
        <Typography variant="body2">
          Over {scoreData.currentOver}.{scoreData.currentBallInOver + 1} - Ball {scoreData.currentBallInOver + 1} of 6
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Batsman Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Batsman (Striker)</InputLabel>
            <Select
              value={currentBall.batsmanId}
              onChange={(e) => setCurrentBall({ ...currentBall, batsmanId: e.target.value })}
            >
              {getBattingTeamPlayers().map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name} ({player.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Non-Striker Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Non-Striker</InputLabel>
            <Select
              value={currentBall.nonStrikerId}
              onChange={(e) => setCurrentBall({ ...currentBall, nonStrikerId: e.target.value })}
            >
              {getBattingTeamPlayers()
                .filter(p => p.id !== currentBall.batsmanId)
                .map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name} ({player.role})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Bowler Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Bowler</InputLabel>
            <Select
              value={currentBall.bowlerId}
              onChange={(e) => setCurrentBall({ ...currentBall, bowlerId: e.target.value })}
            >
              {getBowlingTeamPlayers().map((player) => (
                <MenuItem key={player.id} value={player.id}>
                  {player.name} ({player.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Runs Buttons */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Runs Scored
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {[0, 1, 2, 3, 4, 6].map((run) => (
              <Button
                key={run}
                variant={currentBall.runs === run.toString() ? 'contained' : 'outlined'}
                onClick={() => setCurrentBall({ ...currentBall, runs: run.toString() })}
                size="small"
                sx={{ minWidth: { xs: '48px', sm: '60px' }, flex: { xs: '1 1 30%', sm: '0 0 auto' } }}
              >
                {run}
              </Button>
            ))}
          </Box>
        </Grid>

        {/* Extras Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Extra Type</InputLabel>
            <Select
              value={currentBall.extraType}
              onChange={(e) => setCurrentBall({ ...currentBall, extraType: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="wide">Wide</MenuItem>
              <MenuItem value="noball">No Ball</MenuItem>
              <MenuItem value="bye">Bye</MenuItem>
              <MenuItem value="legbye">Leg Bye</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Extra Runs */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Extra Runs"
            type="number"
            value={currentBall.extras}
            size="small"
            onChange={(e) => setCurrentBall({ ...currentBall, extras: e.target.value })}
          />
        </Grid>

        {/* Wicket Toggle */}
        <Grid item xs={12}>
          <Button
            variant={currentBall.isWicket ? 'contained' : 'outlined'}
            color="error"
            fullWidth
            onClick={() => setCurrentBall({ ...currentBall, isWicket: !currentBall.isWicket })}
          >
            {currentBall.isWicket ? '✓ Wicket' : 'Mark as Wicket'}
          </Button>
        </Grid>

        {/* Dismissal Type */}
        {currentBall.isWicket && (
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Dismissal Type</InputLabel>
              <Select
                value={currentBall.dismissalType}
                onChange={(e) => setCurrentBall({ ...currentBall, dismissalType: e.target.value, fielderId: '' })}
              >
                <MenuItem value="bowled">Bowled</MenuItem>
                <MenuItem value="caught">Caught</MenuItem>
                <MenuItem value="lbw">LBW</MenuItem>
                <MenuItem value="run_out">Run Out</MenuItem>
                <MenuItem value="stumped">Stumped</MenuItem>
                <MenuItem value="hit_wicket">Hit Wicket</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Fielder Selection */}
        {currentBall.isWicket && ['caught', 'run_out', 'stumped'].includes(currentBall.dismissalType) && (
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Fielder *</InputLabel>
              <Select
                value={currentBall.fielderId}
                onChange={(e) => setCurrentBall({ ...currentBall, fielderId: e.target.value })}
                required
              >
                {getBowlingTeamPlayers().map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name} ({player.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Commentary */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Commentary (Optional)"
            multiline
            rows={2}
            value={currentBall.commentary}
            onChange={(e) => setCurrentBall({ ...currentBall, commentary: e.target.value })}
            placeholder="e.g., 'Beautiful cover drive for four!' or 'Edged and caught behind!'"
            helperText="Add description for this ball (shown in commentary section)"
            size="small"
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={onSubmit}
            disabled={submitting || !currentBall.batsmanId || !currentBall.bowlerId}
          >
            {submitting ? 'Submitting...' : 'Submit Ball'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BallEntryForm;
