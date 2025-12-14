import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trophy, Radio, Users, User, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { matchService, teamService, playerService } from '../../api/services';
import AdminLayout from '../../components/admin/AdminLayout';
import CricketLoader from '../../components/CricketLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboardStatic = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalTeams: 0,
    totalPlayers: 0,
  });
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [matchesData, liveData, teamsData, playersData] = await Promise.all([
          matchService.getAllMatches(),
          matchService.getLiveMatches(),
          teamService.getAllTeams(),
          playerService.getAllPlayers()
        ]);
        
        setStats({
          totalMatches: matchesData.matches?.length || matchesData.data?.length || 0,
          liveMatches: liveData.matches?.length || liveData.data?.length || 0,
          totalTeams: teamsData.teams?.length || teamsData.data?.length || 0,
          totalPlayers: playersData.players?.length || playersData.data?.length || 0,
        });
        setLiveMatches(liveData.matches || liveData.data || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle={`Welcome, ${user?.username || ''}`}> 
        <CricketLoader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard" subtitle={`Welcome back, ${user?.username || 'Admin'}. Here's your overview.`}>
      {/* Stats Cards with Premium Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-16 -mr-16"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Matches</p>
                <h3 className="text-4xl font-bold mb-2">
                  {stats.totalMatches}
                </h3>
                <div className="flex items-center gap-1 text-blue-100 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  <span>All time</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-600 to-pink-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-16 -mr-16"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Live Matches</p>
                <h3 className="text-4xl font-bold mb-2">
                  {stats.liveMatches}
                </h3>
                <div className="flex items-center gap-1 text-red-100 text-xs">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>In progress</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Radio className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-16 -mr-16"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Teams</p>
                <h3 className="text-4xl font-bold mb-2">
                  {stats.totalTeams}
                </h3>
                <div className="flex items-center gap-1 text-green-100 text-xs">
                  <Users className="w-3 h-3" />
                  <span>Registered</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600 to-orange-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-16 -mr-16"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-amber-100 text-sm font-medium mb-1">Total Players</p>
                <h3 className="text-4xl font-bold mb-2">
                  {stats.totalPlayers}
                </h3>
                <div className="flex items-center gap-1 text-amber-100 text-xs">
                  <User className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <User className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate('/admin/matches')}
              >
                Manage Matches
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate(`/admin/score-entry/${liveMatches[0]?.id || 1}`)}
                disabled={liveMatches.length === 0}
              >
                <Radio className="mr-2 w-4 h-4" />
                Live Score Entry
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold transition-all duration-200"
                onClick={() => navigate('/admin/teams')}
              >
                Manage Teams
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold transition-all duration-200"
                onClick={() => navigate('/admin/players')}
              >
                Manage Players
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 p-3.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  Recent Activity
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Live updates & actions</p>
              </div>
            </div>
            <div className="space-y-4">
              {liveMatches.length > 0 ? (
                <>
                  <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-2xl border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group/match">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                      {/* Live Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          LIVE
                        </div>
                        <span className="text-xs font-semibold text-gray-700 bg-white/80 px-2.5 py-1 rounded-full">
                          Match #{liveMatches[0].id}
                        </span>
                      </div>
                      
                      {/* Teams */}
                      <div className="mb-3">
                        <p className="text-base font-bold text-gray-900 mb-1 group-hover/match:text-blue-700 transition-colors">
                          {liveMatches[0].team1?.name || liveMatches[0].Team1?.name || 'Team 1'} 
                          <span className="mx-2 text-gray-400 font-normal">vs</span>
                          {liveMatches[0].team2?.name || liveMatches[0].Team2?.name || 'Team 2'}
                        </p>
                      </div>
                      
                      {/* Score */}
                      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-blue-200/50">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Current Score</p>
                          <p className="text-lg font-bold text-gray-900">
                            {liveMatches[0].innings?.[0]?.totalRuns || 0}
                            <span className="text-gray-500 font-normal">/{liveMatches[0].innings?.[0]?.totalWickets || 0}</span>
                          </p>
                        </div>
                        <div className="h-10 w-px bg-gray-300"></div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">Overs</p>
                          <p className="text-lg font-bold text-gray-900">
                            {liveMatches[0].innings?.[0]?.totalOvers || '0.0'}
                            <span className="text-xs text-gray-500 font-normal ml-1">ov</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-between items-center h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group/btn rounded-xl"
                    onClick={() => navigate(`/admin/score-entry/${liveMatches[0]?.id || 1}`)}
                    disabled={liveMatches.length === 0}
                  >
                    <span className="flex items-center gap-2">
                      <Radio className="w-4 h-4 animate-pulse" />
                      Update Score
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Button>
                </>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-gray-200 text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-3">
                      <Radio className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    No live matches at the moment
                  </p>
                  <p className="text-xs text-gray-500">
                    Start a new match to see live activity here
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardStatic;
