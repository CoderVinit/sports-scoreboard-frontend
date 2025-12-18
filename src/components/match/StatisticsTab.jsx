import { Card, Box, Typography, IconButton, Collapse, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const StatisticsTab = ({ 
  currentInnings, 
  statistics, 
  matchStatsOpen, 
  onMatchStatsToggle,
  scoringBreakdownOpen,
  onScoringBreakdownToggle 
}) => {
  // Calculate scoring breakdown
  const totalFours = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.fours || 0), 0) || 0;
  const totalSixes = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.sixes || 0), 0) || 0;
  const boundaryRuns = (totalFours * 4) + (totalSixes * 6);
  const totalRuns = currentInnings?.totalRuns || 0;
  const boundaryPercentage = totalRuns > 0 ? ((boundaryRuns / totalRuns) * 100).toFixed(0) : 0;

  const totalBallsFaced = statistics?.battingStats?.reduce((sum, stat) => sum + (stat.ballsFaced || 0), 0) || 0;
  
  const totalRunScoringBalls = statistics?.battingStats?.reduce((sum, stat) => {
    const boundaryBalls = (stat.fours || 0) + (stat.sixes || 0);
    const nonBoundaryRuns = (stat.runsScored || 0) - ((stat.fours || 0) * 4) - ((stat.sixes || 0) * 6);
    const nonBoundaryBalls = nonBoundaryRuns > 0 ? Math.round(nonBoundaryRuns / 1.5) : 0;
    return sum + boundaryBalls + nonBoundaryBalls;
  }, 0) || 0;
  
  const dotBalls = totalBallsFaced - totalRunScoringBalls;
  const dotBallPercentage = totalBallsFaced > 0 ? ((dotBalls / totalBallsFaced) * 100).toFixed(0) : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ overflow: 'hidden' }}>
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
              Match Statistics
            </Typography>
            <IconButton onClick={onMatchStatsToggle} sx={{ color: 'white' }} size="small">
              {matchStatsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={matchStatsOpen} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Runs</Typography>
                  <Typography variant="h5" fontWeight="bold">{currentInnings?.totalRuns || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Wickets</Typography>
                  <Typography variant="h5" fontWeight="bold">{currentInnings?.totalWickets || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Run Rate</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {currentInnings?.runRate || '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Extras</Typography>
                  <Typography variant="h5" fontWeight="bold">{currentInnings?.extras || 0}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ overflow: 'hidden' }}>
          <Box sx={{ 
            p: 2, 
            background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
              Scoring Breakdown
            </Typography>
            <IconButton onClick={onScoringBreakdownToggle} sx={{ color: 'white' }} size="small">
              {scoringBreakdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={scoringBreakdownOpen} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Runs in Boundaries
              </Typography>
              <Typography variant="h6" gutterBottom>
                {boundaryRuns} ({boundaryPercentage}% of total)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {totalFours} fours, {totalSixes} sixes
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Dot balls percentage
              </Typography>
              <Typography variant="h6">{dotBallPercentage}%</Typography>
              <Typography variant="caption" color="text.secondary">
                {dotBalls} dot balls out of {totalBallsFaced} balls
              </Typography>
            </Box>
          </Collapse>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatisticsTab;
