import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const CurrentBatsmenStats = ({ currentBall, statistics, players }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Current Batsmen
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Batsman</strong></TableCell>
              <TableCell align="center"><strong>R</strong></TableCell>
              <TableCell align="center"><strong>B</strong></TableCell>
              <TableCell align="center"><strong>4s</strong></TableCell>
              <TableCell align="center"><strong>6s</strong></TableCell>
              <TableCell align="center"><strong>SR</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(currentBall.batsmanId || currentBall.nonStrikerId) && statistics?.playerStats ? (
              statistics.playerStats
                .filter(stat => 
                  stat.playerId === currentBall.batsmanId || 
                  stat.playerId === currentBall.nonStrikerId
                )
                .map((stat, index) => {
                  const isStriker = stat.playerId === currentBall.batsmanId;
                  const playerName = stat.player?.name || players.find(p => p.id === stat.playerId)?.name;
                  return (
                    <TableRow key={index} sx={{ bgcolor: isStriker ? 'success.lighter' : 'grey.50' }}>
                      <TableCell>
                        <strong>{playerName} {isStriker ? '*' : ''}</strong>
                      </TableCell>
                      <TableCell align="center">{stat.runsScored || 0}</TableCell>
                      <TableCell align="center">{stat.ballsFaced || 0}</TableCell>
                      <TableCell align="center">{stat.fours || 0}</TableCell>
                      <TableCell align="center">{stat.sixes || 0}</TableCell>
                      <TableCell align="center">{parseFloat(stat.strikeRate || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Select batsmen to see stats
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

export default CurrentBatsmenStats;
