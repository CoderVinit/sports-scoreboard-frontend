import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import UpcomingMatchCard from "./UpcomingMatchCard";

const EmptyUpcomingState = () => (
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
                <div
                  key={i}
                  className={`w-2 h-2 rounded ${i < 2 ? "bg-blue-600" : "bg-blue-200"}`}
                ></div>
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
);

const UpcomingMatchesSection = ({ matches }) => {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <Clock className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Upcoming Matches
        </h2>
      </div>

      {!matches || matches.length === 0 ? (
        <EmptyUpcomingState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.slice(0, 6).map((match) => (
            <UpcomingMatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingMatchesSection;
