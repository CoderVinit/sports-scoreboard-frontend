import { Box, Typography, Tabs, Tab } from '@mui/material';

const InningsTabs = ({ 
  innings, 
  selectedInnings, 
  onSelectInnings,
  team1,
  team2 
}) => {
  if (!innings || innings.length === 0) {
    return null;
  }

  const getTeamName = (battingTeamId) => {
    if (battingTeamId === team1?.id) {
      return team1?.shortName || team1?.name || 'Team 1';
    }
    return team2?.shortName || team2?.name || 'Team 2';
  };

  const getTeamShort = (battingTeamId) => {
    if (battingTeamId === team1?.id) {
      return (team1?.shortName || team1?.name || 'T1').substring(0, 3).toUpperCase();
    }
    return (team2?.shortName || team2?.name || 'T2').substring(0, 3).toUpperCase();
  };

  const currentIndex = innings.findIndex(inn => inn.id === selectedInnings);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        bgcolor: '#f1f5f9',
        borderRadius: '12px',
        p: 0.5,
        gap: 0.5
      }}>
        {innings.map((inn, index) => {
          const isSelected = selectedInnings === inn.id;
          const teamName = getTeamName(inn.battingTeamId);
          const teamShort = getTeamShort(inn.battingTeamId);
          const inningsLabel = inn.inningsNumber === 1 ? '1st Inn' : '2nd Inn';
          
          return (
            <Box
              key={inn.id}
              onClick={() => onSelectInnings(inn.id)}
              sx={{ 
                flex: 1,
                px: 2.5, 
                py: 1.5, 
                cursor: 'pointer',
                bgcolor: isSelected ? 'white' : 'transparent',
                borderRadius: '10px',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                '&:hover': { 
                  bgcolor: isSelected ? 'white' : 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {/* Team Badge */}
                <Box sx={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '8px',
                  background: index === 0 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                    : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                }}>
                  <Typography sx={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '0.65rem',
                    letterSpacing: '0.5px'
                  }}>
                    {teamShort}
                  </Typography>
                </Box>
                
                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ 
                    fontWeight: 600,
                    color: isSelected ? '#1e293b' : '#64748b',
                    fontSize: '0.85rem',
                    lineHeight: 1.2,
                    mb: 0.25
                  }}>
                    {teamName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ 
                      color: isSelected ? '#475569' : '#94a3b8',
                      fontSize: '0.7rem',
                      fontWeight: 500
                    }}>
                      {inningsLabel}
                    </Typography>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '0.7rem' }}>•</Typography>
                    <Typography sx={{ 
                      color: isSelected ? '#1e293b' : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {inn.totalRuns || 0}/{inn.totalWickets || 0}
                    </Typography>
                    <Typography sx={{ 
                      color: isSelected ? '#94a3b8' : '#cbd5e1',
                      fontSize: '0.7rem'
                    }}>
                      ({inn.totalOvers || '0.0'})
                    </Typography>
                  </Box>
                </Box>

                {/* Status Indicator */}
                {inn.status === 'in_progress' && (
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: '#22c55e',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
                  }} />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default InningsTabs;
