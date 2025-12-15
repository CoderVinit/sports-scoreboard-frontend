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
import CricketLoader from '../components/CricketLoader';

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
    return <CricketLoader />;
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

  const renderTeamLogo = (team, fallbackLabel) => {
    const logoUrl = team?.logo;

    return (
      <div className="bg-white/15 backdrop-blur-sm rounded-full mb-2 inline-block border-2 border-white/30">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${team?.name || fallbackLabel} logo`}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <Trophy className="w-10 h-10 m-2" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Featured Match Countdown Hero */}
        {featuredMatch && (
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 via-indigo-700 to-purple-800 text-white overflow-hidden mb-12 shadow-2xl rounded-xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMzJjLTcuNzMgMC0xNC02LjI3LTE0LTE0czYuMjctMTQgMTQtMTQgMTQgNi4yNyAxNCAxNC02LjI3IDE0LTE0IDE0eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
            
            {/* Floating orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            
            <div className="relative mx-auto px-6 py-10">
              {/* Countdown Timer */}
              <div className="flex justify-center gap-4 mb-8">
                {[
                  { value: countdown.days, label: 'days' },
                  { value: countdown.hours, label: 'hours' },
                  { value: countdown.minutes, label: 'minutes' },
                  { value: countdown.seconds, label: 'seconds' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[70px] border border-white/40 shadow-lg hover:bg-white/25 transition-all duration-300">
                      <div className="text-4xl font-extrabold tabular-nums bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-xs mt-2 text-blue-100 uppercase tracking-widest font-semibold">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Match Info */}
              <div className="text-center mb-6">
                <div className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold mb-4 border border-white/40 shadow-lg">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {new Date(featuredMatch.matchDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
              </div>
              
              {/* Teams */}
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="text-center transform hover:scale-105 transition-transform duration-300">
                  {renderTeamLogo(featuredMatch.team1, 'Team 1')}
                  <div className="text-2xl font-extrabold mt-2 drop-shadow-lg">{featuredMatch.team1?.name || 'Team 1'}</div>
                </div>
                
                <div className="text-5xl font-black px-6 bg-white/10 backdrop-blur-sm rounded-full py-2 border border-white/30">VS</div>
                
                <div className="text-center transform hover:scale-105 transition-transform duration-300">
                  {renderTeamLogo(featuredMatch.team2, 'Team 2')}
                  <div className="text-2xl font-extrabold mt-2 drop-shadow-lg">{featuredMatch.team2?.name || 'Team 2'}</div>
                </div>
              </div>
              
              {/* Match Details */}
              <div className="flex items-center justify-center gap-8 text-sm text-blue-100">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{new Date(featuredMatch.matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{featuredMatch.venue}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Original Hero Section for when no featured match */}
        {!featuredMatch && (
          <Card className="mb-12 border-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl overflow-hidden rounded-xl relative">
            <CardContent className="p-8 md:p-16 text-center relative z-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mt-48 -mr-48 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -mb-40 -ml-40 animate-pulse delay-1000"></div>
              <div className="relative z-10">
                <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30 shadow-xl">
                  <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white animate-pulse" />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  Live Cricket Scoreboard
                </h1>
                <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto leading-relaxed font-medium">
                  Experience real-time match updates, comprehensive statistics, and thrilling cricket action
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Matches */}
        {liveMatches && liveMatches.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                  <Link to={`/match/${match.id}`} key={match.id} className="block group">
                    <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group-hover:border-blue-300 group-hover:-translate-y-1">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/30 transition-all duration-300 pointer-events-none"></div>
                      
                      {/* Live Badge */}
                      <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1 flex items-center gap-1.5 z-10 animate-pulse shadow-lg border border-red-500/50">
                        <Radio className="w-3.5 h-3.5" />
                        LIVE
                      </Badge>

                      <CardContent className="pt-4 pb-3 px-4 space-y-3">
                        {/* Match meta */}
                        <div className="text-xs text-gray-600 mb-2 pr-16 flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5">
                            {match.matchFormat || match.matchType}
                          </Badge>
                          <span className="inline-flex items-center gap-1 truncate max-w-[45%]">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="truncate">{match.venue}</span>
                          </span>
                        </div>

                        {/* Teams row */}
                        <div className="space-y-3">
                          {/* Batting Team */}
                          <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 rounded-xl shadow-lg border border-blue-500/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
                              <Avatar className="h-10 w-10 bg-white/20 border-2 border-white/40 flex-shrink-0 shadow-md">
                                <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                                  {(battingTeam?.shortName || battingTeam?.name || 'BAT').substring(0, 3).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-base text-white truncate drop-shadow-sm">
                                  {battingTeam?.shortName || battingTeam?.name || 'Team'}
                                </div>
                                <div className="text-[11px] text-blue-100 font-medium">Batting</div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 relative z-10">
                              <div className="text-3xl font-extrabold text-white leading-none drop-shadow-lg">
                                {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                              </div>
                              <div className="text-[11px] text-blue-100 mt-1 font-medium">
                                ({battingScore.totalOvers || '0.0'}/{totalOvers})
                              </div>
                            </div>
                          </div>

                          {/* Bowling Team */}
                          <div className="flex items-center justify-between gap-2 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 p-4 rounded-xl shadow-md group-hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-500 to-gray-600 flex-shrink-0 shadow-md">
                                <AvatarFallback className="text-white font-bold text-sm">
                                  {(bowlingTeam?.shortName || bowlingTeam?.name || 'BWL').substring(0, 3).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-base text-gray-900 truncate">
                                  {bowlingTeam?.shortName || bowlingTeam?.name || 'Team'}
                                </div>
                                <div className="text-[11px] text-gray-600 font-medium">Bowling</div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold text-gray-800">
                                {bowlingScore.totalRuns > 0 ? 
                                  `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                                  <span className="text-gray-500 italic">Yet to bat</span>
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Progress */}
                        {!isCompletedByInnings && (
                          <div>
                            <div className="flex justify-between items-center mb-1 text-[11px]">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-gray-500">
                                {currentInnings?.totalOvers || '0.0'}/{totalOvers} ov
                              </span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        )}

                        {/* Stats footer */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-gray-600">
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                            <span>
                              CRR: <span className="text-blue-600 font-semibold">
                                {(() => {
                                  const overs = parseFloat(currentInnings?.totalOvers || 0);
                                  const runs = currentInnings?.totalRuns || 0;
                                  return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
                                })()}
                              </span>
                            </span>
                          </div>
                          {isCompletedByInnings && resultText ? (
                            <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full truncate max-w-[50%]">
                              {resultText}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                              In progress
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Upcoming Matches
            </h2>
          </div>
          
          {(!upcomingMatches || upcomingMatches.length === 0) ? (
            <Card className="border-2 border-dashed border-gray-300 bg-white relative overflow-hidden shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center relative z-10">
                {/* Calendar Icon with circular background */}
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-inner relative">
                    {/* Calendar page design */}
                    <div className="w-20 h-20 bg-blue-50 rounded-lg flex flex-col items-center justify-center shadow-md border-2 border-blue-200 relative overflow-hidden">
                      {/* Calendar header */}
                      <div className="w-full h-6 bg-blue-600 rounded-t-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      </div>
                      {/* Calendar grid */}
                      <div className="flex-1 w-full p-2 grid grid-cols-4 gap-1">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded ${i < 2 ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                        ))}
                      </div>
                      {/* Calendar icon overlay */}
                      <Calendar className="absolute w-8 h-8 text-blue-600 opacity-60" />
                    </div>
                  </div>
                </div>
                
                {/* Message */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">📬</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      No matches available right now
                    </h3>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <p className="text-lg text-gray-600 font-medium">
                      Check back later for upcoming competitions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.slice(0, 6).map((match) => (
              <Link to={`/match/${match.id}`} key={match.id} className="block group">
                <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group-hover:border-blue-300 group-hover:-translate-y-1">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/40 group-hover:to-indigo-50/20 transition-all duration-300 pointer-events-none"></div>
                  
                  {/* Match Format Badge - Top Right */}
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs px-3 py-1 shadow-lg z-10 border border-gray-700/50">
                    {match.matchFormat || match.matchType}
                  </Badge>
                  
                  <CardContent className="pt-5 pb-4 px-5 relative z-10">
                    {/* Match Title */}
                    <div className="text-xs text-gray-600 mb-4 pr-16 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium">{match.venue}</span>
                    </div>
                    
                    {/* Teams - Horizontal Layout */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Team 1 */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 flex-shrink-0 shadow-md border-2 border-blue-500/30">
                          <AvatarFallback className="text-white font-bold text-sm">
                            {(match.team1?.shortName || match.team1?.name || match.Team1?.name || 'T1').substring(0, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-gray-900 truncate">
                          {match.team1?.name || match.Team1?.name || 'Team 1'}
                        </span>
                      </div>
                      
                      {/* VS Badge */}
                      <Badge variant="outline" className="px-3 py-1 text-xs font-bold flex-shrink-0 border-2 border-gray-300 bg-gray-50">
                        VS
                      </Badge>
                      
                      {/* Team 2 */}
                      <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                        <span className="font-bold text-sm text-gray-900 truncate">
                          {match.team2?.name || match.Team2?.name || 'Team 2'}
                        </span>
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-600 to-gray-700 flex-shrink-0 shadow-md border-2 border-gray-500/30">
                          <AvatarFallback className="text-white font-bold text-sm">
                            {(match.team2?.shortName || match.team2?.name || match.Team2?.name || 'T2').substring(0, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    
                    {/* Date and Time */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                      <div className="text-xs text-gray-700 flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold">
                            {new Date(match.matchDate).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold">
                            {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Footer Actions */}
                  <div className="border-t border-gray-200 px-5 py-3 flex gap-2 text-xs bg-gray-50/50 relative z-10">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-4 font-semibold transition-all">
                      SCHEDULE
                    </Button>
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-4 font-semibold transition-all">
                      POINTS TABLE
                    </Button>
                  </div>
                 </Card>
               </Link>
             ))}
            </div>
          )}
        </div>

        {/* Completed Matches */}
        {completedMatches && completedMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Completed Matches
              </h2>
            </div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max"
                   style={{ 
                     display: 'flex',
                     gap: '1.5rem'
                   }}>
                {completedMatches.slice(0, 6).map((match) => (
                  <div key={match.id} className="w-[340px] flex-shrink-0">
                {(() => {
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
                  const team1Innings = inningsList.find((inn) => inn.battingTeamId === match.team1Id);
                  const team2Innings = inningsList.find((inn) => inn.battingTeamId === match.team2Id);

                  let resultText = '';
                  
                  // Check if one team didn't bat (match withdrawn/abandoned)
                  if (!team1Innings || !team2Innings) {
                    resultText = 'Match withdrawn due to rain';
                  } else if (firstInnings && secondInnings) {
                    // Determine which team batted first and second
                    const team1Runs = team1Innings?.totalRuns || 0;
                    const team2Runs = team2Innings?.totalRuns || 0;
                    const team1Wickets = team1Innings?.totalWickets || 0;
                    const team2Wickets = team2Innings?.totalWickets || 0;
                    
                    // Determine the batting order
                    const battedFirstTeamId = firstInnings.battingTeamId;
                    const battedSecondTeamId = secondInnings.battingTeamId;
                    
                    const battedFirstTeam = battedFirstTeamId === match.team1Id ? team1 : team2;
                    const battedSecondTeam = battedSecondTeamId === match.team1Id ? team1 : team2;
                    
                    const firstInningsRuns = firstInnings.totalRuns || 0;
                    const secondInningsRuns = secondInnings.totalRuns || 0;
                    const secondInningsWickets = secondInnings.totalWickets || 0;
                    
                    // Team batting second wins if they scored more than or equal to target
                    if (secondInningsRuns > firstInningsRuns) {
                      const wicketsRemaining = 10 - secondInningsWickets;
                      resultText = `${battedSecondTeam.shortName || battedSecondTeam.name} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? '' : 's'}`;
                    } else if (firstInningsRuns > secondInningsRuns) {
                      // Team batting first wins by runs
                      const runMargin = firstInningsRuns - secondInningsRuns;
                      resultText = `${battedFirstTeam.shortName || battedFirstTeam.name} won by ${runMargin} run${runMargin === 1 ? '' : 's'}`;
                    } else {
                      resultText = 'Match tied';
                    }
                  } else if (winnerTeam && match.winMargin) {
                    resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
                  }

                  return (
                    <Link to={`/match/${match.id}`} className="block h-full group">
                    <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-200 hover:border-blue-300 relative overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/40 group-hover:to-indigo-50/20 transition-all duration-300 pointer-events-none"></div>
                      
                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md border border-blue-500/30">
                            {match.matchFormat || match.matchType}
                          </Badge>
                          <Badge variant="secondary" className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 shadow-sm">
                            Completed
                          </Badge>
                        </div>
                        <CardTitle className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                          Final Scores
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 relative z-10">
                        {/* Team 1 */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-10 w-10 ${winnerTeam && winnerTeam.id === team1?.id ? 'bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-300 shadow-lg' : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
                              <AvatarFallback className="text-white font-bold text-sm">
                                {(team1?.shortName || team1?.name || 'T1').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`font-bold text-base ${winnerTeam && winnerTeam.id === team1?.id ? 'text-gray-900' : 'text-gray-700'}`}>
                              {team1?.shortName || team1?.name}
                            </span>
                          </div>
                          <span className="font-extrabold text-base text-gray-900">
                            {team1Innings
                              ? `${team1Innings.totalRuns || 0}/${team1Innings.totalWickets || 0} (${team1Innings.totalOvers || '0.0'})`
                              : <span className="text-gray-500 italic">DNB</span>}
                          </span>
                        </div>

                        {/* Team 2 */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <Avatar className={`h-10 w-10 ${winnerTeam && winnerTeam.id === team2?.id ? 'bg-gradient-to-br from-gray-600 to-gray-700 ring-2 ring-gray-300 shadow-lg' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
                              <AvatarFallback className="text-white font-bold text-sm">
                                {(team2?.shortName || team2?.name || 'T2').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className={`font-bold text-base ${winnerTeam && winnerTeam.id === team2?.id ? 'text-gray-900' : 'text-gray-700'}`}>
                              {team2?.shortName || team2?.name}
                            </span>
                          </div>
                          <span className="font-extrabold text-base text-gray-900">
                            {team2Innings
                              ? `${team2Innings.totalRuns || 0}/${team2Innings.totalWickets || 0} (${team2Innings.totalOvers || '0.0'})`
                              : <span className="text-gray-500 italic">DNB</span>}
                          </span>
                        </div>

                        {resultText && (
                          <div className="mt-4 pt-4 border-t-2 border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
                            <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-2">Result</p>
                            <p className="text-base font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{resultText}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                  );
                })()}
                </div>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
