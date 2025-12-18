import { Box, Typography, Chip, Grid } from "@mui/material";
import { Radio } from "lucide-react";
import LiveMatchCard from "./LiveMatchCard";

const LiveMatchesSection = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <Box sx={{ mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            p: 1.5,
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: 3,
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Radio style={{ width: 28, height: 28, color: 'white' }} />
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
          Live Matches
        </Typography>
        <Chip
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ position: 'relative', width: 10, height: 10 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                    opacity: 0.75,
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: 'white',
                  }}
                />
              </Box>
              LIVE
            </Box>
          }
          sx={{
            bgcolor: '#ef4444',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.75rem',
            animation: 'pulse 2s ease-in-out infinite',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
          }}
        />
      </Box>
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} md={6} xl={4} key={match.id}>
            <LiveMatchCard match={match} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LiveMatchesSection;
