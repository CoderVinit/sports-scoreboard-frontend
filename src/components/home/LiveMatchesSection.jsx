import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import LiveMatchCard from "./LiveMatchCard";

const LiveMatchesSection = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
          <Radio className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Live Matches
        </h2>
        <Badge
          variant="destructive"
          className="animate-pulse px-3 py-1 text-sm font-bold shadow-lg"
        >
          <span className="relative flex h-2.5 w-2.5 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          LIVE
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {matches.map((match) => (
          <LiveMatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default LiveMatchesSection;
