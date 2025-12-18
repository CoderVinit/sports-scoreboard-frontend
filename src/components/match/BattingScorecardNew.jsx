import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip } from '@mui/material';

const formatDismissalText = (stat) => {
  if (stat.isNotOut || stat.dismissalType === 'not_out') {
    return 'not out';
  }
  
  const dismissalType = stat.dismissalType || stat.wicketType;
  const bowlerName = stat.dismissedBy?.name || stat.bowler?.name || '';
  const fielderName = stat.fielder?.name || stat.fieldedBy?.name || '';
  
  switch (dismissalType) {
    case 'bowled':
      return `b ${bowlerName}`;
    case 'caught':
      return fielderName === bowlerName 
        ? `c & b ${bowlerName}` 
        : `c ${fielderName} b ${bowlerName}`;
    case 'lbw':
      return `lbw b ${bowlerName}`;
    case 'run_out':
      return `run out (${fielderName || 'sub'})`;
    case 'stumped':
      return `st ${fielderName} b ${bowlerName}`;
    case 'hit_wicket':
      return `hit wicket b ${bowlerName}`;
    default:
      return dismissalType || '';
  }
};

const BattingScorecardNew = ({ 
  battingStats, 
  teamName, 
  innings,
  currentBatsmanId,
  inningsLabel 
}) => {
  if (!battingStats || battingStats.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8, 
        bgcolor: '#f8fafc', 
        borderRadius: 2,
        mb: 3
      }}>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          No batting data available
        </Typography>
      </Box>
    );
  }

  const totalRuns = innings?.totalRuns || battingStats.reduce((sum, s) => sum + (s.runsScored || 0), 0);
  const totalWickets = innings?.totalWickets || 0;
  const totalOvers = innings?.totalOvers || '0.0';
  const extras = innings?.extras || 0;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
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
            <Typography sx={{ fontSize: '0.9rem' }}>🏏</Typography>
          </Box>
          <Box>
            <Typography sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '0.9rem',
              letterSpacing: '0.3px'
            }}>
              {teamName} Batting
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255,255,255,0.6)', 
              fontSize: '0.7rem'
            }}>
              {inningsLabel || '1st Innings'}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={`${totalRuns}/${totalWickets} (${totalOvers})`}
          size="small"
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.8rem',
            height: 28,
            '& .MuiChip-label': { px: 1.5 }
          }}
        />
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
                width: '40%'
              }}>
                Batter
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>R</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>B</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>4s</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>6s</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5 }}>SR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {battingStats.map((stat, index) => {
              const isStriker = stat.playerId === currentBatsmanId;
              const playerName = stat.player?.name || stat.playerName || `Player ${index + 1}`;
              const dismissalText = formatDismissalText(stat);
              const runs = stat.runsScored || 0;
              const isHighScore = runs >= 50;
              const isCentury = runs >= 100;
              
              return (
                <TableRow 
                  key={stat.playerId || index}
                  sx={{ 
                    bgcolor: isStriker ? 'rgba(34, 197, 94, 0.08)' : 'white',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: isStriker ? 'rgba(34, 197, 94, 0.12)' : '#f8fafc' },
                    '&:last-child td': { borderBottom: 0 }
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: isStriker ? '#22c55e' : '#e2e8f0',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isStriker ? 'white' : '#64748b'
                      }}>
                        {playerName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography sx={{ 
                            fontWeight: 600, 
                            color: '#1e293b', 
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            '&:hover': { color: '#3b82f6' }
                          }}>
                            {playerName}
                          </Typography>
                          {isStriker && (
                            <Box sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              bgcolor: '#22c55e',
                              animation: 'pulse 2s infinite'
                            }} />
                          )}
                          {isCentury && (
                            <Chip label="💯" size="small" sx={{ height: 18, '& .MuiChip-label': { px: 0.5, fontSize: '0.7rem' } }} />
                          )}
                          {isHighScore && !isCentury && (
                            <Chip label="50" size="small" sx={{ height: 18, bgcolor: '#fef3c7', color: '#92400e', '& .MuiChip-label': { px: 0.75, fontSize: '0.65rem', fontWeight: 700 } }} />
                          )}
                        </Box>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem', mt: 0.25 }}>
                          {dismissalText}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ 
                      fontWeight: 700, 
                      color: isHighScore ? '#059669' : '#1e293b', 
                      fontSize: '0.85rem' 
                    }}>
                      {runs}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.ballsFaced || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.fours || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {stat.sixes || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ 
                      color: parseFloat(stat.strikeRate || 0) >= 150 ? '#059669' : '#64748b', 
                      fontSize: '0.8rem',
                      fontWeight: parseFloat(stat.strikeRate || 0) >= 150 ? 600 : 400
                    }}>
                      {parseFloat(stat.strikeRate || 0).toFixed(1)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* Extras Row */}
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ py: 1.5 }}>
                <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem' }}>
                  Extras
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>
                  {extras}
                </Typography>
              </TableCell>
              <TableCell colSpan={4} sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                  (b 0, lb 0, w {innings?.wides || 0}, nb {innings?.noBalls || 0})
                </Typography>
              </TableCell>
            </TableRow>

            {/* Total Row */}
            <TableRow sx={{ bgcolor: '#1e293b' }}>
              <TableCell sx={{ py: 1.5 }}>
                <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
                  Total
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                  {totalRuns}
                </Typography>
              </TableCell>
              <TableCell colSpan={4}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  ({totalWickets} wkts, {totalOvers} Ov)
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BattingScorecardNew;
