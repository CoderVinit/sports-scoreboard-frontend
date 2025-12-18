import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const UpcomingMatchCard = ({ match }) => {
  return (
    <Link to={`/match/${match.id}`} className="block group">
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
                  {(match.team1?.shortName || match.team1?.name || match.Team1?.name || "T1")
                    .substring(0, 3)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-bold text-sm text-gray-900 truncate">
                {match.team1?.name || match.Team1?.name || "Team 1"}
              </span>
            </div>

            {/* VS Badge */}
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs font-bold flex-shrink-0 border-2 border-gray-300 bg-gray-50"
            >
              VS
            </Badge>

            {/* Team 2 */}
            <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
              <span className="font-bold text-sm text-gray-900 truncate">
                {match.team2?.name || match.Team2?.name || "Team 2"}
              </span>
              <Avatar className="h-10 w-10 bg-gradient-to-br from-gray-600 to-gray-700 flex-shrink-0 shadow-md border-2 border-gray-500/30">
                <AvatarFallback className="text-white font-bold text-sm">
                  {(match.team2?.shortName || match.team2?.name || match.Team2?.name || "T2")
                    .substring(0, 3)
                    .toUpperCase()}
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
                  {new Date(match.matchDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold">
                  {new Date(match.matchDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-5 py-3 flex gap-2 text-xs bg-gray-50/50 relative z-10">
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-4 font-semibold transition-all"
          >
            SCHEDULE
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-4 font-semibold transition-all"
          >
            POINTS TABLE
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default UpcomingMatchCard;
