import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft, Radio, MapPin, Calendar } from 'lucide-react';

const MatchInfoHeader = ({ match, onBack }) => {
  const team1Name = match.team1?.name || match.Team1?.name || 'Team 1';
  const team2Name = match.team2?.name || match.Team2?.name || 'Team 2';

  return (
    <>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button 
          onClick={onBack}
          startIcon={<ArrowLeft size={18} />}
          sx={{ 
            color: '#64748b',
            fontWeight: 500,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          Back to Matches
        </Button>
      </Box>

      {/* Match Header Card */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 100%)',
        borderRadius: '16px',
        p: 3,
        mb: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 40%)`,
          pointerEvents: 'none'
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Live Badge & Match ID */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              bgcolor: '#ef4444',
              color: 'white',
              px: 2,
              py: 0.75,
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <Radio size={14} style={{ animation: 'pulse 2s infinite' }} />
              LIVE SCORING
            </Box>
            <Typography sx={{ color: 'rgba(148, 163, 184, 0.8)', fontSize: '0.85rem' }}>
              Match #{match.id}
            </Typography>
          </Box>

          {/* Teams */}
          <Typography sx={{ 
            color: 'white', 
            fontWeight: 800, 
            fontSize: '1.5rem',
            mb: 1.5
          }}>
            {team1Name}
            <Box component="span" sx={{ color: '#64748b', fontWeight: 400, mx: 2 }}>vs</Box>
            {team2Name}
          </Typography>

          {/* Match Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {match.venue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <MapPin size={14} style={{ color: '#60a5fa' }} />
                <Typography sx={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.85rem' }}>
                  {match.venue}
                </Typography>
              </Box>
            )}
            {match.matchDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Calendar size={14} style={{ color: '#60a5fa' }} />
                <Typography sx={{ color: 'rgba(148, 163, 184, 0.9)', fontSize: '0.85rem' }}>
                  {new Date(match.matchDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MatchInfoHeader;
