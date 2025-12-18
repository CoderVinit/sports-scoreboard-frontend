import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { Clock, Calendar } from "lucide-react";
import UpcomingMatchCard from "./UpcomingMatchCard";

const EmptyUpcomingState = () => (
  <Card
    sx={{
      border: '2px dashed',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
    }}
  >
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, px: 3, textAlign: 'center' }}>
      {/* Calendar Icon with circular background */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            width: 96,
            height: 96,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Calendar style={{ width: 48, height: 48, color: '#6366f1' }} />
        </Box>
      </Box>

      {/* Message */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            📬 No matches available right now
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            ⏰ Check back later for upcoming competitions
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const UpcomingMatchesSection = ({ matches }) => {
  return (
    <Box sx={{ mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            p: 1.5,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: 3,
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Clock style={{ width: 28, height: 28, color: 'white' }} />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'linear-gradient(to right, #f1f5f9, #e2e8f0)'
                : 'linear-gradient(to right, #0f172a, #334155, #0f172a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Upcoming Matches
        </Typography>
      </Box>

      {!matches || matches.length === 0 ? (
        <EmptyUpcomingState />
      ) : (
        <Grid container spacing={3}>
          {matches.slice(0, 6).map((match) => (
            <Grid item xs={12} sm={6} lg={4} key={match.id}>
              <UpcomingMatchCard match={match} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UpcomingMatchesSection;
