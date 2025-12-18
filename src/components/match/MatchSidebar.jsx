import { Box, Typography } from '@mui/material';

const InfoRow = ({ label, value, highlight = false, icon = null }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    py: 1.25,
    borderBottom: '1px solid #f1f5f9',
    '&:last-child': { borderBottom: 'none' }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon && <Typography sx={{ fontSize: '0.85rem' }}>{icon}</Typography>}
      <Typography sx={{ 
        color: '#64748b', 
        fontSize: '0.75rem',
        fontWeight: 500
      }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{ 
      color: highlight ? '#ef4444' : '#1e293b', 
      fontSize: '0.75rem',
      fontWeight: highlight ? 700 : 600,
      textAlign: 'right',
      maxWidth: '55%'
    }}>
      {value || '-'}
    </Typography>
  </Box>
);

const StatCard = ({ value, label, color = '#3b82f6', bgColor = 'rgba(59, 130, 246, 0.08)' }) => (
  <Box sx={{ 
    textAlign: 'center', 
    py: 1.5, 
    px: 1,
    bgcolor: bgColor,
    borderRadius: '10px',
    flex: 1
  }}>
    <Typography sx={{ color: color, fontSize: '1.25rem', fontWeight: 800 }}>
      {value}
    </Typography>
    <Typography sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 500 }}>
      {label}
    </Typography>
  </Box>
);

const MatchSidebar = ({ match, currentInnings, statistics }) => {
  const team1 = match?.team1 || match?.Team1;
  const team2 = match?.team2 || match?.Team2;
  const toss = match?.toss || {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Match Info Card */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
          px: 2, 
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Typography sx={{ fontSize: '0.9rem' }}>🏏</Typography>
          <Typography sx={{ 
            color: 'white', 
            fontWeight: 700, 
            fontSize: '0.8rem'
          }}>
            Match Info
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ px: 2, py: 1 }}>
          <InfoRow 
            label="Teams" 
            value={`${team1?.shortName || team1?.name || 'T1'} vs ${team2?.shortName || team2?.name || 'T2'}`} 
          />
          
          <InfoRow 
            label="Status" 
            value={
              <Box component="span" sx={{ 
                px: 1, 
                py: 0.25, 
                borderRadius: '4px',
                bgcolor: match?.status === 'live' ? '#fef2f2' : '#f0fdf4',
                color: match?.status === 'live' ? '#ef4444' : '#22c55e',
                fontWeight: 700,
                fontSize: '0.7rem'
              }}>
                {match?.status?.toUpperCase() || 'UPCOMING'}
              </Box>
            }
          />

          <InfoRow 
            label="Format" 
            value={match?.matchFormat || match?.matchType || 'T20'} 
          />
          
          <InfoRow 
            label="Venue" 
            value={match?.venue || 'TBD'} 
          />

          {toss?.winner && (
            <InfoRow 
              label="Toss" 
              value={`${toss.winner?.shortName || toss.winner?.name || 'Team'} • ${toss.decision}`}
            />
          )}

          <InfoRow 
            label="Date" 
            value={match?.scheduledAt 
              ? new Date(match.scheduledAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'TBD'
            }
          />
        </Box>
      </Box>

      {/* Live Stats Card */}
      {currentInnings && (
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            px: 2, 
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'white',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.5 }
              }
            }} />
            <Typography sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '0.8rem'
            }}>
              Live Stats
            </Typography>
          </Box>

          {/* Run Rate Cards */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <StatCard 
                value={parseFloat(currentInnings.runRate || 0).toFixed(2) || 
                  (currentInnings.totalRuns && currentInnings.totalOvers 
                    ? (parseFloat(currentInnings.totalRuns) / parseFloat(currentInnings.totalOvers)).toFixed(2) 
                    : '0.00')}
                label="Run Rate"
                color="#3b82f6"
                bgColor="rgba(59, 130, 246, 0.08)"
              />
              
              {currentInnings.target && currentInnings.requiredRunRate && (
                <StatCard 
                  value={parseFloat(currentInnings.requiredRunRate || 0).toFixed(2)}
                  label="Required RR"
                  color="#ef4444"
                  bgColor="rgba(239, 68, 68, 0.08)"
                />
              )}
            </Box>

            {currentInnings.target && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 1.5,
                bgcolor: '#fef2f2',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.15)'
              }}>
                <Typography sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 500, mb: 0.25 }}>
                  Target
                </Typography>
                <Typography sx={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 800 }}>
                  {currentInnings.target}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Current Partnership */}
      {statistics?.currentPartnership && (
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
            px: 2, 
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography sx={{ fontSize: '0.9rem' }}>🤝</Typography>
            <Typography sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '0.8rem'
            }}>
              Current Partnership
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography sx={{ 
              color: '#1e293b', 
              fontWeight: 800, 
              fontSize: '1.75rem',
              lineHeight: 1
            }}>
              {statistics.currentPartnership.runs || 0}
            </Typography>
            <Typography sx={{ 
              color: '#64748b', 
              fontSize: '0.75rem',
              fontWeight: 500,
              mt: 0.5
            }}>
              ({statistics.currentPartnership.balls || 0} balls)
            </Typography>
          </Box>
        </Box>
      )}

      {/* Quick Stats */}
      {statistics && (
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            px: 2, 
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography sx={{ fontSize: '0.9rem' }}>📊</Typography>
            <Typography sx={{ 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '0.8rem'
            }}>
              Quick Stats
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <StatCard 
                value={statistics.totalFours || 0}
                label="Fours"
                color="#22c55e"
                bgColor="rgba(34, 197, 94, 0.08)"
              />
              <StatCard 
                value={statistics.totalSixes || 0}
                label="Sixes"
                color="#a855f7"
                bgColor="rgba(168, 85, 247, 0.08)"
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MatchSidebar;
