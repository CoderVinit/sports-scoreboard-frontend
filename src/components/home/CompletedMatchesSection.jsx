import { Trophy } from "lucide-react";
import CompletedMatchCard from "./CompletedMatchCard";

const CompletedMatchesSection = ({ matches }) => {
  if (!matches || matches.length === 0) return null;

  return (
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
        <div
          className="flex gap-6 min-w-max"
          style={{ display: "flex", gap: "1.5rem" }}
        >
          {matches.slice(0, 6).map((match) => (
            <div key={match.id} className="w-[340px] flex-shrink-0">
              <CompletedMatchCard match={match} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedMatchesSection;
