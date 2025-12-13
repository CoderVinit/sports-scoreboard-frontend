import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Trophy, Clipboard, Users, UserCircle, ArrowRight, 
  Radio, Calendar, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { matchService, teamService, playerService } from '../../api/services';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalTeams: 0,
    totalPlayers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [matchesRes, teamsRes, playersRes] = await Promise.all([
          matchService.getAllMatches(),
          teamService.getAllTeams(),
          playerService.getAllPlayers()
        ]);
        
        const matches = matchesRes.data || matchesRes.matches || [];
        const liveCount = matches.filter(m => m.status === 'live').length;
        
        setStats({
          totalMatches: matches.length,
          liveMatches: liveCount,
          totalTeams: (teamsRes.data || teamsRes.teams || []).length,
          totalPlayers: (playersRes.data || playersRes.players || []).length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Matches',
      value: stats.totalMatches,
      icon: Clipboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Live Matches',
      value: stats.liveMatches,
      icon: Radio,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badge: stats.liveMatches > 0
    },
    {
      title: 'Total Teams',
      value: stats.totalTeams,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Players',
      value: stats.totalPlayers,
      icon: UserCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const adminCards = [
    {
      title: 'Matches',
      description: 'Create, edit, and manage cricket matches',
      icon: Clipboard,
      link: '/admin/matches',
      gradient: 'from-blue-600 via-blue-500 to-blue-400',
      hoverGradient: 'hover:from-blue-700 hover:via-blue-600 hover:to-blue-500'
    },
    {
      title: 'Teams',
      description: 'Add and manage cricket teams',
      icon: Users,
      link: '/admin/teams',
      gradient: 'from-green-600 via-green-500 to-emerald-400',
      hoverGradient: 'hover:from-green-700 hover:via-green-600 hover:to-emerald-500'
    },
    {
      title: 'Players',
      description: 'Add and manage player profiles',
      icon: UserCircle,
      link: '/admin/players',
      gradient: 'from-purple-600 via-purple-500 to-purple-400',
      hoverGradient: 'hover:from-purple-700 hover:via-purple-600 hover:to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="w-full px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
            <div className="relative p-8 md:p-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Trophy className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                      Admin Control Panel
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Welcome back, <span className="font-semibold text-white">{user?.username}</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-blue-50 text-base max-w-2xl">
                Manage your cricket tournament with ease. Monitor live matches, update scores, and organize teams efficiently.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className={`border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {stat.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          {stat.badge && stat.value > 0 && (
                            <Badge variant="destructive" className="animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className={`${stat.bgColor} p-4 rounded-xl`}>
                        <IconComponent className={`w-8 h-8 ${stat.color}`} strokeWidth={2} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <Link to={card.link} key={index} className="group">
                    <Card className="h-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`bg-gradient-to-br ${card.gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {card.title}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 mt-2">
                          {card.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0">
                        <Button 
                          className={`w-full bg-gradient-to-r ${card.gradient} ${card.hoverGradient} text-white font-semibold shadow-md group-hover:shadow-xl transition-all duration-300`}
                          size="lg"
                        >
                          <span>Manage</span>
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
