import { Link } from 'react-router-dom';
import { Radio, Calendar, MapPin, TrendingUp, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const LiveMatchCard = ({ match }) => {
  const getRunRate = (runs, overs) => {
    return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
  };

  const getProgressPercentage = (overs, totalOvers) => {
    return totalOvers > 0 ? (overs / totalOvers) * 100 : 0;
  };

  const inningsList = match.innings || [];
  const currentInnings =
    inningsList.find((inn) => inn.status === 'in_progress') ||
    inningsList.find((inn) => inn.inningsNumber === match.currentInnings) ||
    inningsList[inningsList.length - 1] ||
    inningsList[0] ||
    null;
  const totalOvers = match.totalOvers || (match.matchFormat === 'T20' ? 20 : match.matchFormat === 'ODI' ? 50 : 90);
  const currentOvers = parseFloat(currentInnings?.totalOvers || 0);
  const progress = getProgressPercentage(currentOvers, totalOvers);
  
  const isTeam1Batting = currentInnings?.battingTeamId === match.team1Id;
  const battingTeam = isTeam1Batting ? match.team1 : match.team2;
  const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
  const battingScore = currentInnings || { totalRuns: 0, totalWickets: 0, totalOvers: 0 };
  const bowlingScore = inningsList.find((inn) => inn.id !== currentInnings?.id) || { totalRuns: 0, totalWickets: 0 };

  return (
    <Link to={`/match/${match.id}`} className="block group">
      <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-red-400 relative overflow-hidden group-hover:-translate-y-2">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-orange-50/0 group-hover:from-red-50/40 group-hover:to-orange-50/20 transition-all duration-300 pointer-events-none"></div>
        
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-orange-500"></div>
        
        {/* Live Badge */}
        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1.5 flex items-center gap-1.5 z-10 animate-pulse shadow-lg border border-red-500/50">
          <Radio className="w-3.5 h-3.5" />
          LIVE
        </Badge>

        <CardHeader className="pb-3 pt-5 px-5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-2">
              <Trophy className="w-3 h-3 mr-1" />
              {match.matchFormat || match.matchType}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-medium">{match.venue}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span className="font-medium">
                {new Date(match.matchDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 space-y-4 relative z-10">
          {/* Batting Team */}
          <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-red-600 via-red-700 to-orange-700 rounded-xl shadow-lg border border-red-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
              <Avatar className="h-12 w-12 bg-white/20 border-2 border-white/40 flex-shrink-0 shadow-md">
                <AvatarFallback className="bg-transparent text-white font-bold text-sm">
                  {(battingTeam?.shortName || battingTeam?.name || 'BAT').substring(0, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-base text-white truncate drop-shadow-sm">
                  {battingTeam?.shortName || battingTeam?.name || 'Team'}
                </div>
                <div className="text-[11px] text-red-100 font-medium">Batting</div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 relative z-10">
              <div className="text-3xl font-extrabold text-white leading-none drop-shadow-lg">
                {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
              </div>
              <div className="text-[11px] text-red-100 mt-1 font-medium">
                ({battingScore.totalOvers || '0.0'}/{totalOvers})
              </div>
            </div>
          </div>

          {/* Bowling Team */}
          <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl shadow-md">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="h-12 w-12 bg-gradient-to-br from-gray-500 to-gray-600 flex-shrink-0 shadow-md">
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

          {/* Match Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex justify-between items-center mb-2 text-xs">
              <span className="text-gray-700 font-semibold">Match Progress</span>
              <span className="text-gray-600 font-medium">
                {currentInnings?.totalOvers || '0.0'}/{totalOvers} ov
              </span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>

          {/* Stats Footer */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700 font-medium">
                CRR: <span className="text-blue-600 font-extrabold">
                  {getRunRate(battingScore.totalRuns || 0, currentOvers)}
                </span>
              </span>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-700 font-bold">
              In Progress
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LiveMatchCard;
