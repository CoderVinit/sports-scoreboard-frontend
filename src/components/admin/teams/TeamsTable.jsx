import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, IconButton } from '@mui/material';
import { Users, Edit } from 'lucide-react';

const TeamsTable = ({ teams = [], onEdit }) => {
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
                  <Users size={14} />
                  Team
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Short Name
              </TableCell>
              <TableCell sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Players
              </TableCell>
              <TableCell align="center" sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600, fontSize: '0.75rem', py: 2, borderBottom: 'none' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <TableRow 
                  key={team.id} 
                  sx={{ 
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.04)' },
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar 
                        src={team.logo}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          border: '2px solid rgba(34, 197, 94, 0.2)'
                        }}
                      >
                        {team.shortName?.[0] || team.name?.[0]}
                      </Avatar>
                      <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.9rem' }}>
                        {team.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{
                      display: 'inline-flex',
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#f1f5f9',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569'
                    }}>
                      {team.shortName}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      bgcolor: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '8px',
                      color: '#16a34a',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      <Users size={14} />
                      {team.playerCount || 0}
                    </Box>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }}>
                    <IconButton 
                      onClick={() => onEdit(team)}
                      sx={{ 
                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                        '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.15)' }
                      }}
                    >
                      <Edit size={16} style={{ color: '#3b82f6' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
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
                      <Users size={28} style={{ color: '#94a3b8' }} />
                    </Box>
                    <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      No teams found
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Add your first team to get started
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

export default TeamsTable;
