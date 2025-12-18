import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { matchService } from "../api/services";
import { getSocket } from "../utils/socket";
import CricketLoader from "../components/CricketLoader";
import {
  FeaturedMatchCountdown,
  HeroSection,
  LiveMatchesSection,
  UpcomingMatchesSection,
  CompletedMatchesSection,
} from "../components/home";

const HomePage = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [liveData, upcomingData, completedData] = await Promise.all([
          matchService.getLiveMatches(),
          matchService.getUpcomingMatches(),
          matchService.getCompletedMatches(),
        ]);
        setLiveMatches(liveData.data || liveData.matches || []);
        setUpcomingMatches(upcomingData.data || upcomingData.matches || []);
        setCompletedMatches(completedData.data || completedData.matches || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError(err.message || "Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.IO real-time updates only (no polling)
    const socket = getSocket();

    socket.on("ballRecorded", () => {
      console.log("Ball recorded - refreshing home page data");
      fetchData();
    });

    return () => {
      socket.off("ballRecorded");
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const featuredMatch = upcomingMatches[0];
    if (!featuredMatch) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const matchTime = new Date(featuredMatch.matchDate).getTime();
      const distance = matchTime - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingMatches]);

  if (loading) {
    return <CricketLoader />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error" variant="h6" fontWeight={600}>
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
        </Typography>
      </Container>
    );
  }

  // Get featured upcoming match (first upcoming match)
  const featuredMatch = upcomingMatches[0];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Grid pattern overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Top right glow */}
        <Box
          sx={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        {/* Bottom left glow */}
        <Box
          sx={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(99, 102, 241, 0.15)' 
                : 'rgba(99, 102, 241, 0.2)',
            filter: 'blur(48px)',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -160,
            left: -160,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(236, 72, 153, 0.15)' 
                : 'rgba(236, 72, 153, 0.2)',
            filter: 'blur(48px)',
            animation: 'pulse 3s ease-in-out infinite 1s',
          }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 4, position: 'relative', zIndex: 1 }}>
        {/* Featured Match Countdown Hero */}
        {featuredMatch ? (
          <FeaturedMatchCountdown match={featuredMatch} countdown={countdown} />
        ) : (
          <HeroSection />
        )}

        {/* Live Matches */}
        <LiveMatchesSection matches={liveMatches} />

        {/* Upcoming Matches */}
        <UpcomingMatchesSection matches={upcomingMatches} />

        {/* Completed Matches */}
        <CompletedMatchesSection matches={completedMatches} />
      </Container>
    </Box>
  );
};

export default HomePage;
