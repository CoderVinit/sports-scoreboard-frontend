import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip } from '@mui/material';

const BowlingScorecardNew = ({ bowlingStats, teamName }) => {
  if (!bowlingStats || bowlingStats.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        px: 2.5, 
        py: 1.5,
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography sx={{ fontSize: '0.9rem' }}>🎾</Typography>
          </Box>
          <Typography sx={{ 
            color: 'white', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            letterSpacing: '0.3px'
          }}>
            {teamName} Bowling
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ 
        bgcolor: 'white',
        borderRadius: '0 0 12px 12px',
        border: '1px solid #e2e8f0',
        borderTop: 0,
        overflow: 'hidden'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ 
                fontWeight: 600, 
                color: '#64748b', 
                fontSize: '0.7rem', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                py: 1.5,
                width: '35%'
              }}>
                Bowler
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>O</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>M</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>R</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>W</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, display: { xs: 'none', md: 'table-cell' } }}>WD</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, display: { xs: 'none', md: 'table-cell' } }}>NB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>ECO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bowlingStats.map((stat, index) => {
              const playerName = stat.player?.name || stat.playerName || `Bowler ${index + 1}`;
              const wickets = stat.wicketsTaken || 0;
              const isGoodFigures = wickets >= 3;
              const isFifer = wickets >= 5;
              const economy = parseFloat(stat.economy || stat.economyRate || 0);
              
              return (
                <TableRow 
                  key={stat.playerId || index}
                  sx={{ 
                    bgcolor: 'white',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#f8fafc' },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: isGoodFigures ? '#7c3aed' : '#e2e8f0',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isGoodFigures ? 'white' : '#64748b'
                      }}>
                        {playerName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography sx={{ 
                          fontWeight: 600, 
                          color: '#1e293b', 
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          '&:hover': { color: '#7c3aed' }
                        }}>
                          {playerName}
                        </Typography>
                        {isFifer && (
                          <Chip label="5W" size="small" sx={{ height: 18, bgcolor: '#f3e8ff', color: '#7c3aed', '& .MuiChip-label': { px: 0.75, fontSize: '0.65rem', fontWeight: 700 } }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.oversBowled || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.maidenOvers || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.runsConceded || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      bgcolor: isGoodFigures ? '#7c3aed' : '#f1f5f9',
                    }}>
                      <Typography sx={{ 
                        fontWeight: 700, 
                        color: isGoodFigures ? 'white' : '#1e293b',
                        fontSize: '0.85rem'
                      }}>
                        {wickets}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.wides || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.noBalls || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ 
                      color: economy <= 6 ? '#059669' : economy >= 10 ? '#dc2626' : '#64748b',
                      fontSize: '0.8rem',
                      fontWeight: economy <= 6 ? 600 : 400
                    }}>
                      {economy.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BowlingScorecardNew;
