import { useState, useEffect } from "react";
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
      <div className="p-6 text-center">
        <p className="text-lg text-destructive font-semibold">
          {typeof error === "string"
            ? error
            : error?.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Get featured upcoming match (first upcoming match)
  const featuredMatch = upcomingMatches[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
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
      </div>
    </div>
  );
};

export default HomePage;
