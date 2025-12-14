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
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card className="mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none shadow-lg">
          <CardContent className="p-8 md:p-12">
            <Trophy className="w-14 h-14 md:w-18 md:h-18 mx-auto mb-6 text-white" />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Welcome to Cricket Scoreboard
            </h1>
            <p className="text-blue-50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Track live cricket matches, view scores, and statistics in real-time
            </p>
          </CardContent>
        </Card>

        {liveMatches && liveMatches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Radio className="text-red-600 mr-3 w-8 h-8" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Live Matches
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match) => (
                <Card 
                  key={match.id}
                  className="relative overflow-visible cursor-pointer hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-3 right-4 flex items-center gap-1"
                  >
                    <Radio className="w-3 h-3" />
                    LIVE
                  </Badge>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      {match.matchType} • {match.venue}
                    </p>
                    <div className="my-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-lg font-bold">
                          {match.Team1?.name || 'Team 1'}
                        </h3>
                        <span className="text-2xl font-bold text-blue-600">
                          {match.team1Score || 0}/{match.team1Wickets || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 ml-1">
                        ({match.team1Overs || 0} overs)
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className="text-base font-medium mb-1">
                        {match.Team2?.name || 'Team 2'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {match.team2Score ? `${match.team2Score}/${match.team2Wickets}` : 'Yet to bat'}
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600 mb-1">
                        {match.venue}
                      </p>
                      {match.team1Overs > 0 && (
                        <p className="text-sm text-blue-600 font-semibold">
                          CRR: {(match.team1Score / match.team1Overs).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {upcomingMatches && upcomingMatches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-6">
              <Clock className="text-blue-600 mr-2 w-7 h-7" />
              <h2 className="text-2xl font-semibold">
                Upcoming Matches
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {upcomingMatches.map((match) => (
                <Card 
                  key={match.id}
                  className="border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-600 transition-all duration-200 h-full flex flex-col"
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  <CardContent className="p-5 flex-grow">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs font-medium">
                        {match.matchType}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <p className="text-xs text-gray-600">
                          {match.venue}
                        </p>
                      </div>
                    </div>
                    
                    <div className="my-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-8 w-8 bg-blue-600">
                          <AvatarFallback className="text-white text-xs font-semibold">
                            {(match.Team1?.name || 'T1').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">
                          {match.Team1?.name || 'Team 1'}
                        </p>
                      </div>
                      <p className="text-center text-sm font-semibold my-2 text-gray-600">
                        VS
                      </p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 bg-gray-500">
                          <AvatarFallback className="text-white text-xs font-semibold">
                            {(match.Team2?.name || 'T2').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">
                          {match.Team2?.name || 'Team 2'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Button 
            size="lg" 
            className="mr-4 mb-4 md:mb-0 bg-blue-600 hover:bg-blue-700 font-semibold"
            onClick={() => navigate('/live')}
          >
            View All Live Scores
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
            onClick={() => navigate('/login')}
          >
            Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
