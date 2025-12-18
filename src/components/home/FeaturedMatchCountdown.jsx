import { Box, Typography, Avatar } from "@mui/material";
import { Clock, Calendar, MapPin, Trophy, Zap } from "lucide-react";

const FeaturedMatchCountdown = ({ match, countdown }) => {
  if (!match) return null;

  const team1 = match.team1 || match.Team1;
  const team2 = match.team2 || match.Team2;

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0c1929 0%, #1e3a5f 50%, #0c1929 100%)',
        color: 'white',
        overflow: 'hidden',
        mb: 6,
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Animated glow effects */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: '20%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          right: '20%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite 1s',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 } }}>
        {/* Header Badge */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              px: 2.5,
              py: 1,
              borderRadius: '12px',
            }}
          >
            <Zap size={16} style={{ color: '#fbbf24' }} />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Next Match
            </Typography>
          </Box>
        </Box>

        {/* Countdown Timer */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2.5 }, mb: 5 }}>
          {[
            { value: countdown.days, label: "Days" },
            { value: countdown.hours, label: "Hours" },
            { value: countdown.minutes, label: "Mins" },
            { value: countdown.seconds, label: "Secs" },
          ].map((item, idx) => (
            <Box key={idx} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  minWidth: { xs: 60, sm: 80 },
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '1.75rem', sm: '2.5rem' },
                    fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'white',
                    lineHeight: 1,
                  }}
                >
                  {String(item.value).padStart(2, "0")}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  mt: 1.5,
                  color: 'rgba(148, 163, 184, 1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Teams Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: { xs: 2, sm: 4, md: 6 },
            mb: 5,
          }}
        >
          {/* Team 1 */}
          <Box
            sx={{
              textAlign: 'center',
              flex: 1,
              maxWidth: 200,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <Avatar
              src={team1?.logo}
              sx={{
                width: { xs: 70, sm: 90 },
                height: { xs: 70, sm: 90 },
                mx: 'auto',
                mb: 2,
                bgcolor: 'rgba(59, 130, 246, 0.2)',
                border: '3px solid rgba(59, 130, 246, 0.5)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {!team1?.logo && (team1?.shortName || team1?.name || 'T1').substring(0, 2).toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 700,
                color: 'white',
              }}
            >
              {team1?.name || "Team 1"}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              {team1?.shortName || ''}
            </Typography>
          </Box>

          {/* VS Badge */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Time Badge */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                px: 2,
                py: 0.75,
                borderRadius: '10px',
              }}
            >
              <Clock size={14} style={{ color: '#4ade80' }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80' }}>
                {new Date(match.matchDate).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Typography>
            </Box>

            {/* VS Circle */}
            <Box
              sx={{
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <Typography sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 900, color: 'white' }}>
                VS
              </Typography>
            </Box>
          </Box>

          {/* Team 2 */}
          <Box
            sx={{
              textAlign: 'center',
              flex: 1,
              maxWidth: 200,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <Avatar
              src={team2?.logo}
              sx={{
                width: { xs: 70, sm: 90 },
                height: { xs: 70, sm: 90 },
                mx: 'auto',
                mb: 2,
                bgcolor: 'rgba(139, 92, 246, 0.2)',
                border: '3px solid rgba(139, 92, 246, 0.5)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}
            >
              {!team2?.logo && (team2?.shortName || team2?.name || 'T2').substring(0, 2).toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 700,
                color: 'white',
              }}
            >
              {team2?.name || "Team 2"}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              {team2?.shortName || ''}
            </Typography>
          </Box>
        </Box>

        {/* Match Details Footer */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255,255,255,0.08)',
              px: 2.5,
              py: 1,
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Calendar size={16} style={{ color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
              {new Date(match.matchDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255,255,255,0.08)',
              px: 2.5,
              py: 1,
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <MapPin size={16} style={{ color: '#94a3b8' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
              {match.venue}
            </Typography>
          </Box>

          {match.matchFormat && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                px: 2.5,
                py: 1,
                borderRadius: '10px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <Trophy size={16} style={{ color: '#60a5fa' }} />
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa' }}>
                {match.matchFormat}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedMatchCountdown;
