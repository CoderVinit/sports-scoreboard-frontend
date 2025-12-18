import { useState, useEffect } from 'react';
import { matchService } from '../api/services';
import { getSocket } from '../utils/socket';
import CricketLoader from '../components/CricketLoader';
import { Card, CardContent } from '@/components/ui/card';
import { LivePageHeader, LiveMatchCard, NoLiveMatches } from '../components/live';

const LiveScoreboard = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await matchService.getLiveMatches();
        setLiveMatches(response.data || response.matches || []);
      } catch (err) {
        console.error('Error fetching live matches:', err);
        setError(err.message || 'Failed to load live matches');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();

    // Socket.IO real-time updates
    const socket = getSocket();
    
    socket.on('ballRecorded', () => {
      console.log('Ball recorded - refreshing live scoreboard');
      fetchLiveMatches();
    });

    // Also keep polling as fallback
    const interval = setInterval(fetchLiveMatches, 30000);
    
    return () => {
      socket.off('ballRecorded');
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <CricketLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-red-600">
              {typeof error === 'string' ? error : error?.message || 'An error occurred'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (liveMatches.length === 0) {
    return <NoLiveMatches />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 relative overflow-hidden pb-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <LivePageHeader matchCount={liveMatches.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {liveMatches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveScoreboard;
