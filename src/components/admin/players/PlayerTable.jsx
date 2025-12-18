import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton } from '@mui/material';
import { User, Edit, Trash2 } from 'lucide-react';

const getRoleBadge = (role) => {
  const roleStyles = {
    batsman: { bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Batsman' },
    bowler: { bgcolor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', label: 'Bowler' },
    'all-rounder': { bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', label: 'All-Rounder' },
    'wicket-keeper': { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Wicketkeeper' }
  };
  
  const style = roleStyles[role?.toLowerCase()] || roleStyles.batsman;
  
  return (
    <Box sx={{
      display: 'inline-flex',
      px: 1.5,
      py: 0.5,
      borderRadius: '8px',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'capitalize',
      ...style
    }}>
      {style.label}
    </Box>
  );
};

const PlayersTable = ({ players, onEdit, onDelete }) => {
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={14} />
                  Player
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Team
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Jersey
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Role
              </TableCell>
              <TableCell align="center" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <TableRow 
                  key={player.id} 
                  sx={{ 
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.04)' },
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          fontSize: '0.85rem',
                          fontWeight: 700
                        }}
                      >
                        {player.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
                          {player.name}
                          {player.isCaptain && (
                            <Box 
                              component="span" 
                              sx={{ 
                                ml: 1,
                                px: 1,
                                py: 0.25,
                                bgcolor: '#fef3c7',
                                color: '#d97706',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 700
                              }}
                            >
                              C
                            </Box>
                          )}
                        </Typography>
                        {player.nationality && (
                          <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                            {player.nationality}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ color: '#475569', fontSize: '0.85rem' }}>
                      {player.team?.name || player.Team?.name || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    {player.jerseyNumber ? (
                      <Box sx={{
                        display: 'inline-flex',
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        bgcolor: '#f1f5f9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#475569'
                      }}>
                        {player.jerseyNumber}
                      </Box>
                    ) : (
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    {getRoleBadge(player.role)}
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <IconButton 
                        onClick={() => onEdit(player)}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(59, 130, 246, 0.1)',
                          '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.15)' }
                        }}
                      >
                        <Edit size={14} style={{ color: '#3b82f6' }} />
                      </IconButton>
                      <IconButton 
                        onClick={() => onDelete(player.id)}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' }
                        }}
                      >
                        <Trash2 size={14} style={{ color: '#ef4444' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
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
                      <User size={28} style={{ color: '#94a3b8' }} />
                    </Box>
                    <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      No players found
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Add your first player to get started
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

export default PlayersTable;
