import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import MatchActionsMenu from './MatchActionsMenu';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'live':
        return {
          bgcolor: '#fef2f2',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        };
      case 'completed':
        return {
          bgcolor: '#f0fdf4',
          color: '#22c55e',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        };
      default:
        return {
          bgcolor: '#f1f5f9',
          color: '#64748b',
          border: '1px solid #e2e8f0'
        };
    }
  };

  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1.5,
      py: 0.5,
      borderRadius: '8px',
      fontSize: '0.7rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      ...getStatusStyles()
    }}>
      {status === 'live' && (
        <Box sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: '#ef4444',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.4 }
          }
        }} />
      )}
      {status || 'Scheduled'}
    </Box>
  );
};

const MatchesTable = ({ matches, onEdit, onRefresh, navigate }) => {
  return (
    <Box sx={{ 
      bgcolor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)'
            }}>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                #
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Teams
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Venue
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Date
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {matches.length > 0 ? (
              matches.map((match, i) => (
                <TableRow 
                  key={match.id} 
                  sx={{ 
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' },
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                      #{match.id}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box>
                      <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
                        {match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}
                      </Typography>
                      {match.series && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Trophy size={12} style={{ color: '#94a3b8' }} />
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                            {match.series}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={14} style={{ color: '#3b82f6' }} />
                      <Typography sx={{ color: '#475569', fontSize: '0.85rem' }}>
                        {match.venue || 'TBD'}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Calendar size={14} style={{ color: '#64748b' }} />
                      <Typography sx={{ color: '#475569', fontSize: '0.85rem' }}>
                        {match.matchDate 
                          ? new Date(match.matchDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'TBD'
                        }
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <StatusBadge status={match.status} />
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <MatchActionsMenu
                      match={match}
                      onEdit={onEdit}
                      onRefresh={onRefresh}
                      navigate={navigate}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Box sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      bgcolor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <Trophy size={28} style={{ color: '#94a3b8' }} />
                    </Box>
                    <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      No matches found
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Create your first match to get started
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MatchesTable;
