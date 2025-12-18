import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Chip, Avatar, Button } from "@mui/material";
import { Calendar, Clock, MapPin } from "lucide-react";

const UpcomingMatchCard = ({ match }) => {
  return (
    <Link to={`/match/${match.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Card
        sx={{
          height: '100%',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          '&:hover': {
            boxShadow: (theme) => 
              theme.palette.mode === 'dark' 
                ? '0 20px 40px rgba(0,0,0,0.4)' 
                : '0 20px 40px rgba(0,0,0,0.15)',
            borderColor: 'primary.main',
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* Match Format Badge - Top Right */}
        <Chip
          label={match.matchFormat || match.matchType}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.65rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        />

        <CardContent sx={{ pt: 2.5, pb: 2, px: 2.5, position: 'relative', zIndex: 1 }}>
          {/* Match Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pr: 8 }}>
            <MapPin style={{ width: 14, height: 14, color: '#9ca3af' }} />
            <Typography variant="caption" fontWeight={500} color="text.secondary">
              {match.venue}
            </Typography>
          </Box>

          {/* Teams - Horizontal Layout */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            {/* Team 1 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {(match.team1?.shortName || match.team1?.name || match.Team1?.name || "T1")
                  .substring(0, 3)
                  .toUpperCase()}
              </Avatar>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {match.team1?.name || match.Team1?.name || "Team 1"}
              </Typography>
            </Box>

            {/* VS Badge */}
            <Chip
              label="VS"
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                flexShrink: 0,
                borderWidth: 2,
                borderColor: 'divider',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            />

            {/* Team 2 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {match.team2?.name || match.Team2?.name || "Team 2"}
              </Typography>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(71, 85, 105, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {(match.team2?.shortName || match.team2?.name || match.Team2?.name || "T2")
                  .substring(0, 3)
                  .toUpperCase()}
              </Avatar>
            </Box>
          </Box>

          {/* Date and Time */}
          <Box
            sx={{
              background: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(238, 242, 255, 1) 100%)',
              borderRadius: 2,
              p: 1.5,
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Calendar style={{ width: 14, height: 14, color: '#6366f1' }} />
                <Typography variant="caption" fontWeight={600}>
                  {new Date(match.matchDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.disabled">•</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Clock style={{ width: 14, height: 14, color: '#6366f1' }} />
                <Typography variant="caption" fontWeight={600}>
                  {new Date(match.matchDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>

        {/* Footer Actions */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 2.5,
            py: 1.5,
            display: 'flex',
            gap: 1,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Button
            size="small"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.7rem',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            SCHEDULE
          </Button>
          <Button
            size="small"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.7rem',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            POINTS TABLE
          </Button>
        </Box>
      </Card>
    </Link>
  );
};

export default UpcomingMatchCard;
