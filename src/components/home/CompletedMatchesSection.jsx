import { Box, Typography } from "@mui/material";
import { Trophy } from "lucide-react";
import CompletedMatchCard from "./CompletedMatchCard";

const CompletedMatchesSection = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            p: 1.5,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: 3,
            boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trophy style={{ width: 28, height: 28, color: 'white' }} />
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
          Completed Matches
        </Typography>
      </Box>
      <Box
        sx={{
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: 4,
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
          {matches.slice(0, 6).map((match) => (
            <Box key={match.id} sx={{ width: 340, flexShrink: 0 }}>
              <CompletedMatchCard match={match} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CompletedMatchesSection;
