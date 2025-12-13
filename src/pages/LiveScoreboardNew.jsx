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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Card className="group h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 relative overflow-hidden">
                {/* Live Badge */}
                <Badge variant="destructive" className="absolute top-4 right-4 z-10 animate-pulse shadow-lg">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>

                {/* Match Info Header */}
                <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-blue-600 hover:bg-blue-700">
                      <Trophy className="w-3 h-3 mr-1" />
                      {match.matchFormat || match.matchType}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{match.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(match.matchDate).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {/* Teams and Scores */}
                <CardContent className="pt-4 space-y-4">
                  {/* Batting Team */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border-2 border-white/30 bg-white/20">
                          <AvatarFallback className="bg-transparent text-white font-bold text-lg">
                            {battingTeam?.shortName?.charAt(0) || battingTeam?.name?.charAt(0) || 'T'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">
                            {battingTeam?.shortName || battingTeam?.name || 'Team'}
                          </h3>
                          <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/20 hover:bg-white/30 text-xs">
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
                        <Avatar className="h-11 w-11 bg-slate-400">
                          <AvatarFallback className="text-white font-bold text-lg">
                            {bowlingTeam?.shortName?.charAt(0) || bowlingTeam?.name?.charAt(0) || 'T'}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg text-gray-900">
                          {bowlingTeam?.shortName || bowlingTeam?.name || 'Team'}
                        </h3>
                      </div>
                      <div className="text-lg font-bold text-gray-600">
                        {bowlingScore.totalRuns > 0 ? 
                          `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}` : 
                          'Yet to bat'
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>

                <div className="h-px bg-gray-200"></div>

                {/* Match Progress and Stats */}
                <CardContent className="pt-4 pb-4 bg-slate-50 border-t space-y-4">
                  {!isCompletedByInnings && (
                    <div>
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="font-semibold text-gray-600">Match Progress</span>
                        <span className="text-gray-500 font-medium">
                          {currentOvers.toFixed(1)}/{totalOvers} overs
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Match Stats */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      {isCompletedByInnings && resultText ? (
                        <p className="text-sm font-medium text-gray-600">
                          Result: <span className="text-blue-600 font-bold">{resultText}</span>
                        </p>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-medium text-gray-600">
                            CRR: <span className="text-blue-600 font-bold">{getRunRate(battingScore.totalRuns || 0, currentOvers)}</span>
                          </p>
                        </>
                      )}
                    </div>
                    <Badge variant={isCompletedByInnings ? 'secondary' : 'default'} className={!isCompletedByInnings && 'bg-green-100 text-green-800 hover:bg-green-200'}>
                      {isCompletedByInnings ? 'Completed' : 'Match in progress'}
                    </Badge>
                  </div>
                  
                  {match.tossWinner && (
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-sm font-medium text-gray-700 leading-relaxed">
                        {match.tossWinner} won the toss and chose to {match.tossDecision || 'bat'}
                      </p>
                    </div>
                  )}
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
