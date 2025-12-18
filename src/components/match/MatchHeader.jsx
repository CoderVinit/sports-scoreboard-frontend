import { Paper, Box, Typography, Chip } from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MatchHeader = ({ 
  match, 
  firstInnings, 
  secondInnings, 
  firstInningsBattingTeam, 
  secondInningsBattingTeam,
  currentInningsNumber,
  resultText 
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)' 
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          mb: 4, 
          background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
          color: 'white',
          borderRadius: 0,
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '1400px',
          width: '100%',
          boxShadow: 'none'
        }}
      >
        {/* Top Info Bar */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
            {new Date(match.matchDate || match.date).toLocaleDateString('en-US', { 
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }) + ', ' + new Date(match.matchDate || match.date).toLocaleTimeString('en-US', { 
              hour: '2-digit', minute: '2-digit', hour12: false
            })}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
            {match.matchFormat || match.matchType} Match
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {match.venue}
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
              ☀️ 23°
            </Typography>
          </Box>
        </Box>

        {/* LIVE Badge */}
        {match.status === 'live' && (
          <Chip 
            label="LIVE" 
            icon={<SportsCricketIcon sx={{ fontSize: 14 }} />}
            sx={{ 
              position: 'absolute',
              left: 24,
              top: 100,
              bgcolor: '#e53935',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 26,
              px: 1,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.8 }
              }
            }}
          />
        )}

        {/* Teams Score Section */}
        <Box sx={{ mb: 3 }}>
          {/* Second Innings (Current/Latest) */}
          {secondInnings && secondInningsBattingTeam && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 28, 
                  bgcolor: 'white', 
                  borderRadius: 0.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0a1f44'
                }}>
                  {(secondInningsBattingTeam.shortName || secondInningsBattingTeam.name || 'T').substring(0, 3).toUpperCase()}
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  {secondInningsBattingTeam.name || secondInningsBattingTeam.shortName}
                </Typography>
                {match.status === 'live' && currentInningsNumber === 2 && (
                  <SportsCricketIcon sx={{ fontSize: 20, ml: 1, cursor: 'pointer' }} />
                )}
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                {secondInnings.totalRuns ?? 0}/{secondInnings.totalWickets ?? 0}
                <Typography component="span" variant="h6" sx={{ ml: 1, opacity: 0.8, fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  ({secondInnings.totalOvers || '0.0'})
                </Typography>
              </Typography>
            </Box>
          )}

          {/* First Innings */}
          {firstInnings && firstInningsBattingTeam && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              py: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 28, 
                  bgcolor: 'white', 
                  borderRadius: 0.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0a1f44'
                }}>
                  {(firstInningsBattingTeam.shortName || firstInningsBattingTeam.name || 'T').substring(0, 3).toUpperCase()}
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  {firstInningsBattingTeam.name || firstInningsBattingTeam.shortName}
                </Typography>
                {match.status === 'live' && currentInningsNumber === 1 && !secondInnings && (
                  <SportsCricketIcon sx={{ fontSize: 20, ml: 1, cursor: 'pointer' }} />
                )}
              </Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                {firstInnings.totalRuns || 0}/{firstInnings.totalWickets || 0}
                <Typography component="span" variant="h6" sx={{ ml: 1, opacity: 0.8, fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  ({firstInnings.totalOvers || '0.0'})
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>

        {/* Match Status */}
        {match.status === 'completed' && resultText ? (
          <Typography variant="body1" sx={{ mb: 3, fontWeight: 600, fontSize: '0.95rem' }}>
            {resultText}
          </Typography>
        ) : (
          secondInnings?.target &&
          secondInningsBattingTeam &&
          typeof secondInnings.target === 'number' &&
          secondInnings.target > 0 &&
          (secondInnings.target - secondInnings.totalRuns) > 0 && (
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 600, fontSize: '0.95rem' }}>
              {secondInningsBattingTeam?.shortName || secondInningsBattingTeam?.name} need {(secondInnings.target - secondInnings.totalRuns)} runs to win
            </Typography>
          )
        )}

        {/* Toss Info */}
        <Typography variant="body2" sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'rgba(255,255,255,0.1)', opacity: 0.9 }}>
          {match.tossWinner?.shortName || match.tossWinner?.name || 'Team'} won the toss and chose to {match.tossDecision}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MatchHeader;
