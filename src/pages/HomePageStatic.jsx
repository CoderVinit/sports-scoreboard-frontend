import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Radio, Clock, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { matchService } from '../api/services';
import CricketLoader from '../components/CricketLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const HomePage = () => {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const [liveData, upcomingData] = await Promise.all([
          matchService.getLiveMatches(),
          matchService.getUpcomingMatches()
        ]);
        setLiveMatches(liveData.data || liveData.matches || []);
        setUpcomingMatches(upcomingData.data || upcomingData.matches || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <CricketLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        <Card className="mb-12 text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white border-none shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mt-48 -mr-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -mb-40 -ml-40 animate-pulse delay-1000"></div>
          <CardContent className="p-8 md:p-16 relative z-10">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30 shadow-xl">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto text-white animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Welcome to Cricket Scoreboard
            </h1>
            <p className="text-blue-50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              Track live cricket matches, view scores, and statistics in real-time
            </p>
          </CardContent>
        </Card>

        {liveMatches && liveMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Live Matches
              </h2>
              <Badge variant="destructive" className="animate-pulse px-3 py-1 text-sm font-bold shadow-lg">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                LIVE
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match) => (
                <Card 
                  key={match.id}
                  className="relative overflow-visible cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-200 hover:border-red-300 group bg-white"
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-orange-50/0 group-hover:from-red-50/30 group-hover:to-orange-50/20 transition-all duration-300 pointer-events-none rounded-lg"></div>
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-3 right-4 flex items-center gap-1.5 px-3 py-1 shadow-lg z-10 bg-gradient-to-r from-red-600 to-red-700 border border-red-500/50"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    LIVE
                  </Badge>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs font-medium px-2 py-0.5">
                        {match.matchType}
                      </Badge>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-600 font-medium">{match.venue}</span>
                    </div>
                    <div className="my-4 space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-xl shadow-lg border border-blue-500/30">
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {match.Team1?.name || 'Team 1'}
                          </h3>
                          <p className="text-xs text-blue-100 mt-0.5">Batting</p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-extrabold text-white block">
                            {match.team1Score || 0}/{match.team1Wickets || 0}
                          </span>
                          <p className="text-xs text-blue-100 mt-1">
                            ({match.team1Overs || 0} overs)
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                        <div>
                          <p className="text-base font-bold text-gray-900">
                            {match.Team2?.name || 'Team 2'}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">Bowling</p>
                        </div>
                        <p className="text-lg font-bold text-gray-800">
                          {match.team2Score ? `${match.team2Score}/${match.team2Wickets}` : <span className="text-gray-500 italic">Yet to bat</span>}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-medium">
                          {match.venue}
                        </p>
                        {match.team1Overs > 0 && (
                          <p className="text-sm text-blue-600 font-extrabold">
                            CRR: <span className="text-base">{(match.team1Score / match.team1Overs).toFixed(2)}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {upcomingMatches && upcomingMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Upcoming Matches
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <Card 
                  key={match.id}
                  className="border-2 border-gray-200 cursor-pointer hover:shadow-2xl hover:border-blue-300 transition-all duration-300 h-full flex flex-col group hover:-translate-y-1 bg-white"
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/40 group-hover:to-indigo-50/20 transition-all duration-300 pointer-events-none rounded-lg"></div>
                  <CardContent className="p-6 flex-grow relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-2">
                        {match.matchType}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <p className="text-xs text-gray-600 font-medium">
                          {match.venue}
                        </p>
                      </div>
                    </div>
                    
                    <div className="my-5 space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 shadow-md border-2 border-blue-500/30">
                          <AvatarFallback className="text-white text-sm font-bold">
                            {(match.Team1?.name || 'T1').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-bold text-gray-900">
                          {match.Team1?.name || 'Team 1'}
                        </p>
                      </div>
                      <p className="text-center text-sm font-extrabold my-2 text-gray-500 bg-gray-100 rounded-full py-1">
                        VS
                      </p>
                      <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-600 to-gray-700 shadow-md border-2 border-gray-500/30">
                          <AvatarFallback className="text-white text-sm font-bold">
                            {(match.Team2?.name || 'T2').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-bold text-gray-900">
                          {match.Team2?.name || 'Team 2'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-gray-700 font-bold">
                          {new Date(match.matchDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 font-semibold ml-6">
                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate('/live')}
            >
              View All Live Scores
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-base px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate('/login')}
            >
              Admin Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
