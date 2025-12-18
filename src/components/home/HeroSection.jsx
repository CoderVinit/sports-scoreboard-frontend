import { Box, Card, CardContent, Typography } from "@mui/material";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <Card
      sx={{
        mb: 6,
        border: 'none',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)',
        color: 'white',
        boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.4)',
        overflow: 'hidden',
        borderRadius: 4,
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Background decorations */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 384,
            height: 384,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            filter: 'blur(48px)',
            mt: -24,
            mr: -24,
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 320,
            height: 320,
            bgcolor: 'rgba(167, 139, 250, 0.2)',
            borderRadius: '50%',
            filter: 'blur(48px)',
            mb: -20,
            ml: -20,
            animation: 'pulse 3s ease-in-out infinite 1s',
          }}
        />
        
        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              borderRadius: 4,
              mb: 3,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <Sparkles style={{ width: 64, height: 64, color: 'white' }} />
          </Box>
          
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 3,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, white, #c7d2fe, white)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            Live Cricket Scoreboard
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              color: 'rgba(224, 231, 255, 1)',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            Experience real-time match updates, comprehensive statistics,
            and thrilling cricket action
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HeroSection;
