import { Paper, Box, Typography, IconButton, Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const BowlingScorecard = ({ 
  bowlingStats, 
  teamName, 
  isOpen, 
  onToggle 
}) => {
  return (
    <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
        color: 'white', 
        p: 2.5,
        boxShadow: '0 2px 8px rgba(21, 101, 192, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '0.3px' }}>
          {teamName || 'Team'} Bowling
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
                <TableCell><strong>Bowler</strong></TableCell>
                <TableCell align="center"><strong>O</strong></TableCell>
                <TableCell align="center"><strong>M</strong></TableCell>
                <TableCell align="center"><strong>R</strong></TableCell>
                <TableCell align="center"><strong>W</strong></TableCell>
                <TableCell align="center"><strong>Econ</strong></TableCell>
                <TableCell align="center"><strong>Wd</strong></TableCell>
                <TableCell align="center"><strong>Nb</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bowlingStats?.length > 0 ? bowlingStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell><strong>{stat.player?.name}</strong></TableCell>
                  <TableCell align="center">{parseFloat(stat.oversBowled || 0).toFixed(1)}</TableCell>
                  <TableCell align="center">{stat.maidenOvers || 0}</TableCell>
                  <TableCell align="center">{stat.runsConceded || 0}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {stat.wicketsTaken || 0}
                  </TableCell>
                  <TableCell align="center">{parseFloat(stat.economyRate || 0).toFixed(2)}</TableCell>
                  <TableCell align="center">{stat.wides || 0}</TableCell>
                  <TableCell align="center">{stat.noBalls || 0}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">No bowling statistics available</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

export default BowlingScorecard;
