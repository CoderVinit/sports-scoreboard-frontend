import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin, Radio, TrendingUp } from "lucide-react";

const LiveMatchCard = ({ match }) => {
  const inningsList = match.innings || [];
  const firstInnings =
    inningsList.find((inn) => inn.inningsNumber === 1) ||
    inningsList[0] ||
    null;
  const secondInnings =
    inningsList.find((inn) => inn.inningsNumber === 2) ||
    (inningsList.length > 1 ? inningsList[1] : null);
  const currentInnings =
    inningsList.find((inn) => inn.status === "in_progress") ||
    inningsList.find((inn) => inn.inningsNumber === match.currentInnings) ||
    inningsList[inningsList.length - 1] ||
    inningsList[0] ||
    null;
  const totalOvers =
    match.totalOvers ||
    (match.matchFormat === "T20" ? 20 : match.matchFormat === "ODI" ? 50 : 90);
  const progress = currentInnings
    ? (parseFloat(currentInnings.totalOvers || 0) / totalOvers) * 100
    : 0;

  const isTeam1Batting = currentInnings?.battingTeamId === match.team1Id;
  const battingTeam = isTeam1Batting ? match.team1 : match.team2;
  const bowlingTeam = isTeam1Batting ? match.team2 : match.team1;
  const battingScore = currentInnings || { totalRuns: 0, totalWickets: 0 };
  const bowlingScore = inningsList.find(
    (inn) => inn.id !== currentInnings?.id
  ) || { totalRuns: 0, totalWickets: 0 };

  const isCompletedByInnings = !!(
    firstInnings &&
    secondInnings &&
    secondInnings.status === "completed"
  );
  const winnerTeam =
    match.winnerId === match.team1Id
      ? match.team1
      : match.winnerId === match.team2Id
      ? match.team2
      : null;

  let resultText = "";
  if (isCompletedByInnings) {
    if (winnerTeam && match.winMargin) {
      resultText = `${winnerTeam.shortName || winnerTeam.name} won by ${match.winMargin}`;
    } else {
      const firstRuns = firstInnings?.totalRuns || 0;
      const secondRuns = secondInnings?.totalRuns || 0;
      const target = secondInnings?.target || firstRuns + 1;

      if (secondRuns >= target) {
        const wicketsRemaining = 10 - (secondInnings?.totalWickets || 0);
        const chasingTeam =
          secondInnings.battingTeamId === match.team1Id
            ? match.team1
            : match.team2;
        const wk = wicketsRemaining > 0 ? wicketsRemaining : 1;
        resultText = `${chasingTeam.shortName || chasingTeam.name} won by ${wk} wicket${wk === 1 ? "" : "s"}`;
      } else if (firstRuns > secondRuns) {
        const margin = firstRuns - secondRuns;
        const defendingTeam =
          firstInnings.battingTeamId === match.team1Id
            ? match.team1
            : match.team2;
        resultText = `${defendingTeam.shortName || defendingTeam.name} won by ${margin} run${margin === 1 ? "" : "s"}`;
      } else if (firstRuns === secondRuns) {
        resultText = "Match tied";
      }
    }
  }

  return (
    <Link to={`/match/${match.id}`} className="block group">
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
                    {(battingTeam?.shortName || battingTeam?.name || "BAT")
                      .substring(0, 3)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-base text-white truncate drop-shadow-sm">
                    {battingTeam?.shortName || battingTeam?.name || "Team"}
                  </div>
                  <div className="text-[11px] text-blue-100 font-medium">Batting</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 relative z-10">
                <div className="text-3xl font-extrabold text-white leading-none drop-shadow-lg">
                  {`${battingScore.totalRuns || 0}/${battingScore.totalWickets || 0}`}
                </div>
                <div className="text-[11px] text-blue-100 mt-1 font-medium">
                  ({battingScore.totalOvers || "0.0"}/{totalOvers})
                </div>
              </div>
            </div>

            {/* Bowling Team */}
            <div className="flex items-center justify-between gap-2 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 p-4 rounded-xl shadow-md group-hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-500 to-gray-600 flex-shrink-0 shadow-md">
                  <AvatarFallback className="text-white font-bold text-sm">
                    {(bowlingTeam?.shortName || bowlingTeam?.name || "BWL")
                      .substring(0, 3)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-base text-gray-900 truncate">
                    {bowlingTeam?.shortName || bowlingTeam?.name || "Team"}
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium">Bowling</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-gray-800">
                  {bowlingScore.totalRuns > 0 ? (
                    `${bowlingScore.totalRuns || 0}/${bowlingScore.totalWickets || 0}`
                  ) : (
                    <span className="text-gray-500 italic">Yet to bat</span>
                  )}
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
                  {currentInnings?.totalOvers || "0.0"}/{totalOvers} ov
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
                CRR:{" "}
                <span className="text-blue-600 font-semibold">
                  {(() => {
                    const overs = parseFloat(currentInnings?.totalOvers || 0);
                    const runs = currentInnings?.totalRuns || 0;
                    return overs > 0 ? (runs / overs).toFixed(2) : "0.00";
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
};

export default LiveMatchCard;
