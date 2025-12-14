import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, Box, Grid, Button, ButtonGroup,
  Card, CardContent, TextField, MenuItem, Divider, Alert, Chip
} from '@mui/material';
import { fetchMatchById, updateMatch } from '../../features/matches/matchSlice';
import { recordBall } from '../../features/innings/inningsSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import CricketLoader from '../../components/CricketLoader';

const AdminScoreEntry = () => {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const { currentMatch, loading } = useSelector((state) => state.matches);
  
  const [ballData, setBallData] = useState({
    runs: 0,
    extras: 0,
    wicket: false,
    batsmanId: '',
    bowlerId: '',
    ballType: 'legal'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMatchById(matchId));
  }, [matchId, dispatch]);

  const handleRunClick = (runs) => {
    setBallData({ ...ballData, runs });
  };

  const handleWicket = () => {
    setBallData({ ...ballData, wicket: !ballData.wicket });
  };

  const handleExtraType = (type) => {
    setBallData({ ...ballData, ballType: type });
  };

  const submitBall = async () => {
    try {
      await dispatch(recordBall({
        matchId,
        inningsId: currentMatch.currentInningsId,
        ...ballData
      }));
      setMessage('Ball recorded successfully');
      setBallData({
        runs: 0,
        extras: 0,
        wicket: false,
        batsmanId: '',
        bowlerId: '',
        ballType: 'legal'
      });
      setTimeout(() => setMessage(''), 3000);
      dispatch(fetchMatchById(matchId));
    } catch (error) {
      setMessage('Error recording ball');
    }
  };

  const handleUndoLastBall = () => {
    // Implementation for undo
    setMessage('Undo functionality not yet implemented');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading || !currentMatch) {
    return (
      <AdminLayout title="Score Entry" subtitle="Record ball-by-ball updates for the selected match.">
        <CricketLoader />
      </AdminLayout>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          Score Entry - {currentMatch.team1Name} vs {currentMatch.team2Name}
        </Typography>
        <Typography variant="body1">
          {currentMatch.matchType} • {currentMatch.venue}
        </Typography>
      </Paper>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>
      )}

      <Grid container spacing={3}>
        {/* Current Score Display */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Current Score</Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {currentMatch.team1Score}/{currentMatch.team1Wickets}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Overs: {currentMatch.team1Overs || 0}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  CRR: {currentMatch.currentRunRate?.toFixed(2) || '0.00'} • 
                  RRR: {currentMatch.requiredRunRate?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Current Batsmen</Typography>
                <Chip label="Batsman 1 - 45(32)" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Batsman 2 - 23(18)" size="small" />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Current Bowler</Typography>
                <Chip label="Bowler - 2/25 (3.2)" size="small" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Score Entry Panel */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Score Entry Panel
            </Typography>

            {/* Runs Buttons */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Runs Scored
              </Typography>
              <ButtonGroup size="large" fullWidth>
                {[0, 1, 2, 3, 4, 6].map((run) => (
                  <Button
                    key={run}
                    variant={ballData.runs === run ? 'contained' : 'outlined'}
                    onClick={() => handleRunClick(run)}
                    sx={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      bgcolor: ballData.runs === run ? (run === 6 ? 'success.main' : run === 4 ? 'primary.main' : undefined) : undefined
                    }}
                  >
                    {run}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            {/* Wicket Button */}
            <Box sx={{ mb: 3 }}>
              <Button
                fullWidth
                variant={ballData.wicket ? 'contained' : 'outlined'}
                color="error"
                size="large"
                onClick={handleWicket}
                sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                {ballData.wicket ? 'WICKET SELECTED' : 'WICKET'}
              </Button>
            </Box>

            {/* Extras */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Extras
              </Typography>
              <ButtonGroup fullWidth>
                <Button
                  variant={ballData.ballType === 'wide' ? 'contained' : 'outlined'}
                  onClick={() => handleExtraType('wide')}
                >
                  Wide
                </Button>
                <Button
                  variant={ballData.ballType === 'noBall' ? 'contained' : 'outlined'}
                  onClick={() => handleExtraType('noBall')}
                >
                  No Ball
                </Button>
                <Button
                  variant={ballData.ballType === 'bye' ? 'contained' : 'outlined'}
                  onClick={() => handleExtraType('bye')}
                >
                  Bye
                </Button>
                <Button
                  variant={ballData.ballType === 'legBye' ? 'contained' : 'outlined'}
                  onClick={() => handleExtraType('legBye')}
                >
                  Leg Bye
                </Button>
              </ButtonGroup>
            </Box>

            {/* Player Selection */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Batsman on Strike"
                  value={ballData.batsmanId}
                  onChange={(e) => setBallData({ ...ballData, batsmanId: e.target.value })}
                >
                  <MenuItem value="1">Batsman 1</MenuItem>
                  <MenuItem value="2">Batsman 2</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Current Bowler"
                  value={ballData.bowlerId}
                  onChange={(e) => setBallData({ ...ballData, bowlerId: e.target.value })}
                >
                  <MenuItem value="1">Bowler 1</MenuItem>
                  <MenuItem value="2">Bowler 2</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Submit Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={submitBall}
                  sx={{ fontSize: '1.2rem', fontWeight: 'bold', py: 2 }}
                >
                  SUBMIT BALL
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  size="large"
                  onClick={handleUndoLastBall}
                  sx={{ py: 2 }}
                >
                  UNDO
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Recent Balls */}
          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              This Over
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[1, 'W', 4, 1, 6, 'Wd'].map((ball, idx) => (
                <Chip
                  key={idx}
                  label={ball}
                  color={
                    ball === 'W' ? 'error' : 
                    ball === 6 ? 'success' : 
                    ball === 4 ? 'primary' : 
                    'default'
                  }
                  sx={{ fontSize: '1rem', fontWeight: 'bold', minWidth: 40 }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminScoreEntry;
