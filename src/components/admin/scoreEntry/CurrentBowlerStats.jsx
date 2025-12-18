import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const CurrentBowlerStats = ({ currentBall, statistics, players }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Current Bowler
      </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBall.bowlerId && statistics?.playerStats ? (
              statistics.playerStats
                .filter(stat => stat.playerId === currentBall.bowlerId)
                .map((stat, index) => {
                  const playerName = stat.player?.name || players.find(p => p.id === currentBall.bowlerId)?.name;
                  return (
                    <TableRow key={index} sx={{ bgcolor: 'info.lighter' }}>
                      <TableCell><strong>{playerName}</strong></TableCell>
                      <TableCell align="center">{stat.oversBowled || 0}</TableCell>
                      <TableCell align="center">{stat.maidenOvers || 0}</TableCell>
                      <TableCell align="center">{stat.runsConceded || 0}</TableCell>
                      <TableCell align="center">{stat.wicketsTaken || 0}</TableCell>
                      <TableCell align="center">{parseFloat(stat.economyRate || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Select a bowler to see stats
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CurrentBowlerStats;
