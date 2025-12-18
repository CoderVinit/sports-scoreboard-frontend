import { Paper, Box, Typography, IconButton, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Format dismissal text helper
const formatDismissalText = (stat) => {
  if (!stat.isOut) {
    return 'Not Out';
  }
  
  const dismissalType = stat.dismissalType;
  const bowler = stat.dismissalBowler?.name;
  const fielder = stat.dismissalFielder?.name;
  
  if (dismissalType === 'caught' && fielder && bowler) {
    return `c ${fielder} b ${bowler}`;
  } else if (dismissalType === 'bowled' && bowler) {
    return `b ${bowler}`;
  } else if (dismissalType === 'lbw' && bowler) {
    return `lbw b ${bowler}`;
  } else if (dismissalType === 'stumped' && fielder && bowler) {
    return `st ${fielder} b ${bowler}`;
  } else if (dismissalType === 'run_out' && fielder) {
    return `run out (${fielder})`;
  } else if (dismissalType === 'hit_wicket' && bowler) {
    return `hit wicket b ${bowler}`;
  }
  return dismissalType || 'out';
};

const BattingScorecard = ({ 
  innings, 
  battingStats, 
  teamName, 
  match,
  currentInnings,
  statistics,
  isOpen, 
  onToggle,
  showStrikerHighlight = false
}) => {
  if (!innings) return null;

  const displayTeamName = teamName || 
    innings?.battingTeam?.shortName || 
    innings?.battingTeam?.name || 
    (innings?.battingTeamId === match?.team1Id ? (match?.team1?.shortName || match?.team1?.name) : (match?.team2?.shortName || match?.team2?.name)) || 
    'Team';

  return (
    <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #2196f3 100%)',
        color: 'white', 
        p: 2.5,
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
          {displayTeamName} Innings - {innings?.totalRuns || 0}/{innings?.totalWickets || 0} ({innings?.totalOvers || '0.0'} ov)
        </Typography>
        <IconButton onClick={onToggle} sx={{ color: 'white' }} size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Batter</strong></TableCell>
                <TableCell align="center"><strong>R</strong></TableCell>
                <TableCell align="center"><strong>B</strong></TableCell>
                <TableCell align="center"><strong>4s</strong></TableCell>
                <TableCell align="center"><strong>6s</strong></TableCell>
                <TableCell align="center"><strong>SR</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {battingStats?.length > 0 ? battingStats.map((stat, index) => {
                // Determine if this batsman is on strike
                const notOutBatsmen = battingStats?.filter(s => !s.isOut) || [];
                
                let isOnStrike = false;
                if (showStrikerHighlight) {
                  if (stat.isOnStrike === true) {
                    isOnStrike = true;
                  } else if (currentInnings?.strikerId && stat.player?.id === currentInnings?.strikerId) {
                    isOnStrike = true;
                  } else if (statistics?.currentStriker?.id && stat.player?.id === statistics?.currentStriker?.id) {
                    isOnStrike = true;
                  } else if (!stat.isOut && notOutBatsmen.length === 1) {
                    isOnStrike = true;
                  } else if (!stat.isOut && notOutBatsmen.length === 2 && index === battingStats.findIndex(s => !s.isOut)) {
                    isOnStrike = true;
                  }
                }
                
                const dismissalText = formatDismissalText(stat);

                return (
                  <TableRow key={index} sx={{ bgcolor: isOnStrike ? 'success.lighter' : 'inherit' }}>
                    <TableCell>
                      <Box>
                        <Typography fontWeight={isOnStrike ? 'bold' : 'normal'}>
                          {stat.player?.name} {isOnStrike && '⭐'}
                        </Typography>
                        <Typography variant="caption" color={!stat.isOut ? 'success.main' : 'text.secondary'} sx={{ fontStyle: 'italic' }}>
                          {dismissalText}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{stat.runsScored || 0}</TableCell>
                    <TableCell align="center">{stat.ballsFaced || 0}</TableCell>
                    <TableCell align="center">{stat.fours || 0}</TableCell>
                    <TableCell align="center">{stat.sixes || 0}</TableCell>
                    <TableCell align="center">{parseFloat(stat.strikeRate || 0).toFixed(2)}</TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">No batting statistics available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Extras & Total */}
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2">
            <strong>Extras:</strong> {innings?.extras || 0}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            <strong>Total:</strong> {innings?.totalRuns || 0}/{innings?.totalWickets || 0} ({innings?.totalOvers || '0.0'} ov)
          </Typography>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default BattingScorecard;
