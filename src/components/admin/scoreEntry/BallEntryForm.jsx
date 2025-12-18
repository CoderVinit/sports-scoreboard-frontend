import { 
  Box, Typography, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Send, AlertTriangle } from 'lucide-react';

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

  const selectStyle = {
    borderRadius: '10px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6', borderWidth: '1px' }
  };

  return (
    <Box sx={{ 
      bgcolor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2.5,
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
          Enter Ball Details
        </Typography>
        <Box sx={{
          bgcolor: 'rgba(59, 130, 246, 0.2)',
          px: 2,
          py: 0.75,
          borderRadius: '8px'
        }}>
          <Typography sx={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600 }}>
            Over {scoreData.currentOver}.{scoreData.currentBallInOver + 1}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          {/* Player Selection Row */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Batsman (Striker)</InputLabel>
              <Select
                value={currentBall.batsmanId}
                onChange={(e) => setCurrentBall({ ...currentBall, batsmanId: e.target.value })}
                sx={selectStyle}
              >
                {getBattingTeamPlayers().map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Non-Striker</InputLabel>
              <Select
                value={currentBall.nonStrikerId}
                onChange={(e) => setCurrentBall({ ...currentBall, nonStrikerId: e.target.value })}
                sx={selectStyle}
              >
                {getBattingTeamPlayers()
                  .filter(p => p.id !== currentBall.batsmanId)
                  .map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                      {player.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Bowler</InputLabel>
              <Select
                value={currentBall.bowlerId}
                onChange={(e) => setCurrentBall({ ...currentBall, bowlerId: e.target.value })}
                sx={selectStyle}
              >
                {getBowlingTeamPlayers().map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Runs Buttons */}
          <Grid item xs={12}>
            <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '0.85rem', mb: 1.5 }}>
              Runs Scored
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4, 6].map((run) => (
                <Box
                  key={run}
                  onClick={() => setCurrentBall({ ...currentBall, runs: run.toString() })}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    bgcolor: currentBall.runs === run.toString() 
                      ? (run === 6 ? '#22c55e' : run === 4 ? '#3b82f6' : '#0c1929')
                      : '#f1f5f9',
                    color: currentBall.runs === run.toString() ? 'white' : '#475569',
                    border: '2px solid',
                    borderColor: currentBall.runs === run.toString() 
                      ? 'transparent'
                      : '#e2e8f0',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      borderColor: '#3b82f6'
                    }
                  }}
                >
                  {run}
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Extras Row */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Extra Type</InputLabel>
              <Select
                value={currentBall.extraType}
                onChange={(e) => setCurrentBall({ ...currentBall, extraType: e.target.value })}
                sx={selectStyle}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="wide">Wide</MenuItem>
                <MenuItem value="noball">No Ball</MenuItem>
                <MenuItem value="bye">Bye</MenuItem>
                <MenuItem value="legbye">Leg Bye</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Extra Runs"
              type="number"
              value={currentBall.extras}
              size="small"
              onChange={(e) => setCurrentBall({ ...currentBall, extras: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': selectStyle
              }}
            />
          </Grid>

          {/* Wicket Button */}
          <Grid item xs={12}>
            <Box
              onClick={() => setCurrentBall({ ...currentBall, isWicket: !currentBall.isWicket })}
              sx={{
                p: 2,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                bgcolor: currentBall.isWicket ? '#ef4444' : '#fef2f2',
                color: currentBall.isWicket ? 'white' : '#ef4444',
                border: '2px solid',
                borderColor: currentBall.isWicket ? '#ef4444' : '#fecaca',
                fontWeight: 700,
                '&:hover': {
                  transform: 'scale(1.01)',
                  bgcolor: currentBall.isWicket ? '#dc2626' : '#fee2e2'
                }
              }}
            >
              <AlertTriangle size={20} />
              {currentBall.isWicket ? '✓ WICKET SELECTED' : 'WICKET'}
            </Box>
          </Grid>

          {/* Dismissal Type - Only shown when wicket is selected */}
          {currentBall.isWicket && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Dismissal Type</InputLabel>
                <Select
                  value={currentBall.dismissalType}
                  onChange={(e) => setCurrentBall({ ...currentBall, dismissalType: e.target.value, fielderId: '' })}
                  sx={selectStyle}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Fielder *</InputLabel>
                <Select
                  value={currentBall.fielderId}
                  onChange={(e) => setCurrentBall({ ...currentBall, fielderId: e.target.value })}
                  required
                  sx={selectStyle}
                >
                  {getBowlingTeamPlayers().map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                      {player.name}
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
              placeholder="e.g., 'Beautiful cover drive for four!'"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#94a3b8' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' }
                }
              }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              onClick={onSubmit}
              disabled={submitting || !currentBall.batsmanId || !currentBall.bowlerId}
              startIcon={<Send size={18} />}
              sx={{
                py: 1.75,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 16px rgba(34, 197, 94, 0.4)'
                },
                '&.Mui-disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Ball'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BallEntryForm;
