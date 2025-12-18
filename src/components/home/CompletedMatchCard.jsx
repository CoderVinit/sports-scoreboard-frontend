import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CompletedMatchCard = ({ match }) => {
  const inningsList = match.innings || [];
  const firstInnings =
    inningsList.find((inn) => inn.inningsNumber === 1) || inningsList[0] || null;
  const secondInnings =
    inningsList.find((inn) => inn.inningsNumber === 2) ||
    (inningsList.length > 1 ? inningsList[1] : null);

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

  let resultText = "";

  // Check if one team didn't bat (match withdrawn/abandoned)
  if (!team1Innings || !team2Innings) {
    resultText = "Match withdrawn due to rain";
  } else if (firstInnings && secondInnings) {
    const battedFirstTeamId = firstInnings.battingTeamId;
    const battedSecondTeamId = secondInnings.battingTeamId;

    const battedFirstTeam = battedFirstTeamId === match.team1Id ? team1 : team2;
    const battedSecondTeam = battedSecondTeamId === match.team1Id ? team1 : team2;

    const firstInningsRuns = firstInnings.totalRuns || 0;
    const secondInningsRuns = secondInnings.totalRuns || 0;
    const secondInningsWickets = secondInnings.totalWickets || 0;

    if (secondInningsRuns > firstInningsRuns) {
      const wicketsRemaining = 10 - secondInningsWickets;
      resultText = `${battedSecondTeam.shortName || battedSecondTeam.name} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? "" : "s"}`;
    } else if (firstInningsRuns > secondInningsRuns) {
      const runMargin = firstInningsRuns - secondInningsRuns;
      resultText = `${battedFirstTeam.shortName || battedFirstTeam.name} won by ${runMargin} run${runMargin === 1 ? "" : "s"}`;
    } else {
      resultText = "Match tied";
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
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 shadow-sm"
            >
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
              <Avatar
                className={`h-10 w-10 ${
                  winnerTeam && winnerTeam.id === team1?.id
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 ring-2 ring-blue-300 shadow-lg"
                    : "bg-gradient-to-br from-blue-600 to-blue-700"
                }`}
              >
                <AvatarFallback className="text-white font-bold text-sm">
                  {(team1?.shortName || team1?.name || "T1").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span
                className={`font-bold text-base ${
                  winnerTeam && winnerTeam.id === team1?.id ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {team1?.shortName || team1?.name}
              </span>
            </div>
            <span className="font-extrabold text-base text-gray-900">
              {team1Innings ? (
                `${team1Innings.totalRuns || 0}/${team1Innings.totalWickets || 0} (${team1Innings.totalOvers || "0.0"})`
              ) : (
                <span className="text-gray-500 italic">DNB</span>
              )}
            </span>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar
                className={`h-10 w-10 ${
                  winnerTeam && winnerTeam.id === team2?.id
                    ? "bg-gradient-to-br from-gray-600 to-gray-700 ring-2 ring-gray-300 shadow-lg"
                    : "bg-gradient-to-br from-gray-600 to-gray-700"
                }`}
              >
                <AvatarFallback className="text-white font-bold text-sm">
                  {(team2?.shortName || team2?.name || "T2").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span
                className={`font-bold text-base ${
                  winnerTeam && winnerTeam.id === team2?.id ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {team2?.shortName || team2?.name}
              </span>
            </div>
            <span className="font-extrabold text-base text-gray-900">
              {team2Innings ? (
                `${team2Innings.totalRuns || 0}/${team2Innings.totalWickets || 0} (${team2Innings.totalOvers || "0.0"})`
              ) : (
                <span className="text-gray-500 italic">DNB</span>
              )}
            </span>
          </div>

          {resultText && (
            <div className="mt-4 pt-4 border-t-2 border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
              <p className="text-xs uppercase tracking-widest text-gray-600 font-bold mb-2">
                Result
              </p>
              <p className="text-base font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {resultText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompletedMatchCard;
