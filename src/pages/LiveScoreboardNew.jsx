import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchService, inningsService } from '../api/services';
import { getSocket } from '../utils/socket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Radio, MapPin, Calendar, TrendingUp, Trophy } from 'lucide-react';

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

    // Socket.IO real-time updates only (no polling)
    const socket = getSocket();
    
    socket.on('ballRecorded', () => {
      console.log('Ball recorded - refreshing live scoreboard');
      fetchLiveMatches();
    });

    return () => {
      socket.off('ballRecorded');
    };
  }, []);

  const getRunRate = (runs, overs) => {
    return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
  };

  const getProgressPercentage = (overs, totalOvers) => {
    return (overs / totalOvers) * 100;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-lg text-destructive font-semibold">
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  if (liveMatches.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-16">
          <Radio className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No live matches at the moment</h2>
          <p className="text-gray-500">Check back later for live cricket action!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pb-8">
      <div className="w-full py-8 px-6">
        {/* Page Header */}
        <Card className="mb-8 bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center space-y-0 pb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-4">
              <Radio className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-1">Live Cricket Matches</CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                {liveMatches.length} {liveMatches.length === 1 ? 'match' : 'matches'} in progress
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {liveMatches && liveMatches.map((match) => {
          const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
          const inningsList = match.innings || [];
          const currentInnings =
            inningsList.find((inn) => inn.status === 'in_progress') ||
            inningsList.find((inn) => inn.inningsNumber === match.currentInnings) ||
            inningsList[inningsList.length - 1] ||
            inningsList[0] ||
            null;

          const currentOvers = parseFloat(currentInnings?.totalOvers || 0);
          const progress = getProgressPercentage(currentOvers, totalOvers);
          const isTeam1Batting = currentInnings?.battingTeamId === match.team1Id;
          
          // Determine batting and bowling teams for current innings
          const battingTeam = isTeam1Batting ? match.team1 : match.team2;
          const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
          const battingScore = currentInnings || { totalRuns: 0, totalWickets: 0, totalOvers: '0.0' };
          const bowlingScore = inningsList.find((inn) => inn.id !== currentInnings?.id) || { totalRuns: 0, totalWickets: 0 };

          const firstInnings = inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
          const secondInnings = inningsList.find((inn) => inn.inningsNumber === 2) || (inningsList.length > 1 ? inningsList[1] : null);

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
              <Card className="h-full bg-white hover:shadow-lg transition-shadow duration-200 border border-gray-200 relative overflow-hidden">
                {/* Live Badge */}
                <Badge className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-0.5 flex items-center gap-1 z-10 animate-pulse">
                  <Radio className="w-3 h-3" />
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
                  <div className="space-y-2">
                    {/* Batting Team */}
                    <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Avatar className="h-8 w-8 bg-white/20 border border-white/30 flex-shrink-0">
                          <AvatarFallback className="bg-transparent text-white font-bold text-xs">
                            {(battingTeam?.shortName || battingTeam?.name || 'BAT').substring(0, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-white truncate">
                            {battingTeam?.shortName || battingTeam?.name || 'Team'}
                          </div>
                          <div className="text-[10px] text-blue-100">Batting</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-white leading-none">
                          {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                        </div>
                        <div className="text-[10px] text-blue-100 mt-0.5">
                          ({battingScore.totalOvers || '0.0'}/{totalOvers})
                        </div>
                      </div>
                    </div>

                    {/* Bowling Team */}
                    <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Avatar className="h-8 w-8 bg-gray-400 flex-shrink-0">
                          <AvatarFallback className="text-white font-bold text-xs">
                            {(bowlingTeam?.shortName || bowlingTeam?.name || 'BWL').substring(0, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-gray-900 truncate">
                            {bowlingTeam?.shortName || bowlingTeam?.name || 'Team'}
                          </div>
                          <div className="text-[10px] text-gray-500">Bowling</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-gray-700">
                          {bowlingScore.totalRuns > 0 ? 
                            `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                            'Yet to bat'
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
                          {currentOvers.toFixed(1)}/{totalOvers} ov
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
                        CRR: <span className="text-blue-600 font-semibold">{getRunRate(battingScore.totalRuns || 0, currentOvers || 1)}</span>
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
    </div>
  );
};

export default LiveScoreboard;
