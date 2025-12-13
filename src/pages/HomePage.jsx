import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { matchService } from '../api/services';
import { getSocket } from '../utils/socket';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, MapPin, Trophy, TrendingUp, Radio, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [liveData, upcomingData, completedData] = await Promise.all([
          matchService.getLiveMatches(),
          matchService.getUpcomingMatches(),
          matchService.getCompletedMatches()
        ]);
        setLiveMatches(liveData.data || liveData.matches || []);
        setUpcomingMatches(upcomingData.data || upcomingData.matches || []);
        setCompletedMatches(completedData.data || completedData.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err.message || 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.IO real-time updates only (no polling)
    const socket = getSocket();
    
    socket.on('ballRecorded', () => {
      console.log('Ball recorded - refreshing home page data');
      fetchData();
    });

    return () => {
      socket.off('ballRecorded');
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
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [upcomingMatches]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-destructive font-semibold">
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </p>
      </div>
    );
  }

  // Get featured upcoming match (first upcoming match)
  const featuredMatch = upcomingMatches[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="w-full">
        {/* Featured Match Countdown Hero */}
        {featuredMatch && (
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden mb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMzJjLTcuNzMgMC0xNC02LjI3LTE0LTE0czYuMjctMTQgMTQtMTQgMTQgNi4yNyAxNCAxNC02LjI3IDE0LTE0IDE0eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
            
            <div className="relative max-w-6xl mx-auto px-6 py-6">
              {/* Countdown Timer */}
              <div className="flex justify-center gap-3 mb-6">
                {[
                  { value: countdown.days, label: 'days' },
                  { value: countdown.hours, label: 'hours' },
                  { value: countdown.minutes, label: 'minutes' },
                  { value: countdown.seconds, label: 'seconds' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] border border-white/30">
                      <div className="text-3xl font-bold tabular-nums">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-xs mt-1 text-blue-100 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Match Info */}
              <div className="text-center mb-4">
                <div className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-3 border border-white/30">
                  {new Date(featuredMatch.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
              </div>
              
              {/* Teams */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="bg-white/15 backdrop-blur-sm p-3 rounded-full mb-2 inline-block border-2 border-white/30">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <div className="text-xl font-bold">{featuredMatch.team1?.name || 'Team 1'}</div>
                </div>
                
                <div className="text-4xl font-bold px-4">VS</div>
                
                <div className="text-center">
                  <div className="bg-white/15 backdrop-blur-sm p-3 rounded-full mb-2 inline-block border-2 border-white/30">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <div className="text-xl font-bold">{featuredMatch.team2?.name || 'Team 2'}</div>
                </div>
              </div>
              
              {/* Match Details */}
              <div className="flex items-center justify-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(featuredMatch.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{featuredMatch.venue}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Original Hero Section for when no featured match */}
        {!featuredMatch && (
          <Card className="mb-12 border-none bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl overflow-hidden rounded-none">
            <CardContent className="p-8 md:p-12 text-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mb-24 -ml-24"></div>
              <div className="relative z-10">
                <Sparkles className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                  Live Cricket Scoreboard
                </h1>
                <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed">
                  Experience real-time match updates, comprehensive statistics, and thrilling cricket action
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Matches */}
        {liveMatches && liveMatches.length > 0 && (
          <div className="mb-12 px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Radio className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Live Matches</h2>
              <Badge variant="destructive" className="animate-pulse">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveMatches.map((match) => {
                const inningsList = match.innings || [];
                const firstInnings = inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
                const secondInnings = inningsList.find((inn) => inn.inningsNumber === 2) || (inningsList.length > 1 ? inningsList[1] : null);
                const currentInnings =
                  inningsList.find((inn) => inn.status === 'in_progress') ||
                  inningsList.find((inn) => inn.inningsNumber === match.currentInnings) ||
                  inningsList[inningsList.length - 1] ||
                  inningsList[0] ||
                  null;
                const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
                const progress = currentInnings ? (parseFloat(currentInnings.totalOvers || 0) / totalOvers) * 100 : 0;
                
                const isTeam1Batting = currentInnings?.battingTeamId === match.team1Id;
                const battingTeam = isTeam1Batting ? match.team1 : match.team2;
                const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
                const battingScore = currentInnings || { totalRuns: 0, totalWickets: 0 };
                const bowlingScore = inningsList.find((inn) => inn.id !== currentInnings?.id) || { totalRuns: 0, totalWickets: 0 };

                const isCompletedByInnings = !!(firstInnings && secondInnings && secondInnings.status === 'completed');
                const winnerTeam =
                  match.winnerId === match.team1Id
                    ? match.team1
                    : match.winnerId === match.team2Id
                    ? match.team2
                    : null;

                let resultText = '';
                if (isCompletedByInnings) {
                  if (winnerTeam && match.winMargin) {
                    resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
                  } else {
                    const firstRuns = firstInnings?.totalRuns || 0;
                    const secondRuns = secondInnings?.totalRuns || 0;
                    const target = secondInnings?.target || (firstRuns + 1);

                    if (secondRuns >= target) {
                      const wicketsRemaining = 10 - (secondInnings?.totalWickets || 0);
                      const chasingTeam = secondInnings.battingTeamId === match.team1Id ? match.team1 : match.team2;
                      const wk = wicketsRemaining > 0 ? wicketsRemaining : 1;
                      resultText = `${chasingTeam.shortName || chasingTeam.name} won by ${wk} wicket${wk === 1 ? '' : 's'}`;
                    } else if (firstRuns > secondRuns) {
                      const margin = firstRuns - secondRuns;
                      const defendingTeam = firstInnings.battingTeamId === match.team1Id ? match.team1 : match.team2;
                      resultText = `${defendingTeam.shortName || defendingTeam.name} won by ${margin} run${margin === 1 ? '' : 's'}`;
                    } else if (firstRuns === secondRuns) {
                      resultText = 'Match tied';
                    }
                  }
                }
                
                return (
                  <Link to={`/match/${match.id}`} key={match.id} className="block">
                    <Card className="group h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 overflow-hidden">
                      <CardHeader className="pb-3 relative bg-gradient-to-r from-slate-50 to-blue-50">
                        <Badge variant="destructive" className="absolute top-4 right-4 animate-pulse shadow-lg">
                          <Radio className="w-3 h-3 mr-1" />
                          LIVE
                        </Badge>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className="bg-blue-600 hover:bg-blue-700">{match.matchFormat || match.matchType}</Badge>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{match.venue}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-4 space-y-4">
                        {/* Batting Team */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-white/30 bg-white/20">
                                <AvatarFallback className="bg-transparent text-white font-bold text-lg">
                                  {(battingTeam?.shortName || 'T').charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold text-lg leading-tight">{battingTeam?.shortName || 'Team'}</h3>
                                <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/20 hover:bg-white/30">
                                  Batting
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-extrabold leading-none">
                                {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                              </div>
                              <div className="text-sm font-medium text-blue-100 mt-1">
                                ({battingScore.totalOvers || '0.0'}/{totalOvers} ov)
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        
                        {/* Bowling Team */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 bg-slate-400">
                                <AvatarFallback className="text-white font-bold text-lg">
                                  {(bowlingTeam?.shortName || 'T').charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="font-bold text-lg text-gray-900">{bowlingTeam?.shortName || 'Team'}</h3>
                            </div>
                            <div className="text-lg font-bold text-gray-600">
                              {bowlingScore.totalRuns > 0 ? 
                                `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                                'Yet to bat'
                              }
                            </div>
                          </div>
                        </div>
                        
                        {!isCompletedByInnings && currentInnings && (
                          <div>
                            <div className="flex justify-between items-center mb-2 text-sm">
                              <span className="font-semibold text-gray-600">Match Progress</span>
                              <span className="text-gray-500 font-medium">
                                {currentInnings.totalOvers || '0.0'}/{totalOvers} overs
                              </span>
                            </div>
                            <Progress value={progress} className="h-2.5" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                          {isCompletedByInnings && resultText ? (
                            <p className="text-sm font-medium text-gray-600">
                              Result: <span className="text-blue-600 font-bold">{resultText}</span>
                            </p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <p className="text-sm font-medium text-gray-600">
                                CRR: <span className="text-blue-600 font-bold">
                                  {currentInnings ? (currentInnings.totalRuns / parseFloat(currentInnings.totalOvers || 1)).toFixed(2) : '0.00'}
                                </span>
                              </p>
                            </div>
                          )}
                          <Badge variant={isCompletedByInnings ? 'secondary' : 'default'} className="bg-green-100 text-green-800 hover:bg-green-200">
                            {isCompletedByInnings ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md group-hover:shadow-lg transition-all">
                          View Live Score
                          <TrendingUp className="w-4 h-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div className="mb-12 px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Matches</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches && upcomingMatches.slice(0, 6).map((match) => (
              <Link to={`/match/${match.id}`} key={match.id} className="block">
                <Card className="group h-full bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-blue-400">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <Badge className="bg-blue-600 hover:bg-blue-700">{match.matchFormat || match.matchType}</Badge>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-medium">{match.venue}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 pt-0">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-blue-600">
                          <AvatarFallback className="text-white font-bold">
                            {(match.team1?.name || match.Team1?.name || 'T1').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-gray-900">{match.team1?.name || match.Team1?.name || 'Team 1'}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <Badge variant="outline" className="font-bold">VS</Badge>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-slate-400">
                          <AvatarFallback className="text-white font-bold">
                            {(match.team2?.name || match.Team2?.name || 'T2').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-gray-900">{match.team2?.name || match.Team2?.name || 'Team 2'}</h3>
                      </div>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-3.5 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          {new Date(match.matchDate).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all">
                      View Details
                      <TrendingUp className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Completed Matches */}
        {completedMatches && completedMatches.length > 0 && (
          <div className="px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Trophy className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Completed Matches</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMatches.slice(0, 6).map((match) => {
                const inningsList = match.innings || [];
                const firstInnings = inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
                const secondInnings = inningsList.find((inn) => inn.inningsNumber === 2) || (inningsList.length > 1 ? inningsList[1] : null);

                const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);

                const winnerTeam =
                  match.winnerId === match.team1Id
                    ? match.team1
                    : match.winnerId === match.team2Id
                    ? match.team2
                    : null;

                const team1 = match.team1;
                const team2 = match.team2;
                const team1Innings = inningsList.find((inn) => inn.battingTeamId === match.team1Id) || firstInnings;
                const team2Innings = inningsList.find((inn) => inn.battingTeamId === match.team2Id) || secondInnings;

                let resultText = '';
                if (winnerTeam && match.winMargin) {
                  resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
                } else if (firstInnings && secondInnings) {
                  const firstRuns = firstInnings.totalRuns || 0;
                  const secondRuns = secondInnings.totalRuns || 0;
                  const target = secondInnings.target || (firstRuns + 1);

                  if (secondRuns >= target) {
                    const wicketsRemaining = 10 - (secondInnings.totalWickets || 0);
                    const chasingTeam = secondInnings.battingTeamId === match.team1Id ? match.team1 : match.team2;
                    const wk = wicketsRemaining > 0 ? wicketsRemaining : 1;
                    resultText = `${chasingTeam.shortName || chasingTeam.name} won by ${wk} wicket${wk === 1 ? '' : 's'}`;
                  } else if (firstRuns > secondRuns) {
                    const margin = firstRuns - secondRuns;
                    const defendingTeam = firstInnings.battingTeamId === match.team1Id ? match.team1 : match.team2;
                    resultText = `${defendingTeam.shortName || defendingTeam.name} won by ${margin} run${margin === 1 ? '' : 's'}`;
                  } else if (firstRuns === secondRuns) {
                    resultText = 'Match tied';
                  }
                }

                return (
                  <Link to={`/match/${match.id}`} key={match.id} className="block">
                    <Card className="group h-full bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border hover:border-slate-400">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-blue-600 hover:bg-blue-700">{match.matchFormat || match.matchType}</Badge>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <CardTitle className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                          Final Scores
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        {/* Team 1 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-8 w-8 ${winnerTeam && winnerTeam.id === team1?.id ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-blue-600'}`}>
                              <AvatarFallback className="text-white font-bold text-sm">
                                {(team1?.shortName || team1?.name || 'T1').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`font-${winnerTeam && winnerTeam.id === team1?.id ? 'bold' : 'medium'} text-sm ${winnerTeam && winnerTeam.id === team1?.id ? 'text-gray-900' : 'text-gray-600'}`}>
                              {team1?.shortName || team1?.name}
                            </span>
                          </div>
                          <span className="font-semibold text-sm text-gray-900">
                            {team1Innings
                              ? `${team1Innings.totalRuns || 0}/${team1Innings.totalWickets || 0} (${team1Innings.totalOvers || '0.0'})`
                              : 'DNB'}
                          </span>
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-8 w-8 ${winnerTeam && winnerTeam.id === team2?.id ? 'bg-slate-400 ring-2 ring-slate-200' : 'bg-slate-400'}`}>
                              <AvatarFallback className="text-white font-bold text-sm">
                                {(team2?.shortName || team2?.name || 'T2').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`font-${winnerTeam && winnerTeam.id === team2?.id ? 'bold' : 'medium'} text-sm ${winnerTeam && winnerTeam.id === team2?.id ? 'text-gray-900' : 'text-gray-600'}`}>
                              {team2?.shortName || team2?.name}
                            </span>
                          </div>
                          <span className="font-semibold text-sm text-gray-900">
                            {team2Innings
                              ? `${team2Innings.totalRuns || 0}/${team2Innings.totalWickets || 0} (${team2Innings.totalOvers || '0.0'})`
                              : 'DNB'}
                          </span>
                        </div>

                        {resultText && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Result</p>
                            <p className="text-sm font-bold text-blue-600">{resultText}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-300">© 2025 CricScore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
