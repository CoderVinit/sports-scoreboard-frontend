import { Clock, Calendar, MapPin, Trophy } from "lucide-react";

const FeaturedMatchCountdown = ({ match, countdown }) => {
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

  if (!match) return null;

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 via-indigo-700 to-purple-800 text-white overflow-hidden mb-12 shadow-2xl rounded-xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMzJjLTcuNzMgMC0xNC02LjI3LTE0LTE0czYuMjctMTQgMTQtMTQgMTQgNi4yNyAxNCAxNC02LjI3IDE0LTE0IDE0eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative mx-auto px-6 py-10">
        {/* Countdown Timer */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { value: countdown.days, label: "days" },
            { value: countdown.hours, label: "hours" },
            { value: countdown.minutes, label: "minutes" },
            { value: countdown.seconds, label: "seconds" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[70px] border border-white/40 shadow-lg hover:bg-white/25 transition-all duration-300">
                <div className="text-4xl font-extrabold tabular-nums bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                  {String(item.value).padStart(2, "0")}
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
            {new Date(match.matchDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            {renderTeamLogo(match.team1, "Team 1")}
            <div className="text-2xl font-extrabold mt-2 drop-shadow-lg">
              {match.team1?.name || "Team 1"}
            </div>
          </div>

          <div className="text-5xl font-black px-6 bg-white/10 backdrop-blur-sm rounded-full py-2 border border-white/30">
            VS
          </div>

          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            {renderTeamLogo(match.team2, "Team 2")}
            <div className="text-2xl font-extrabold mt-2 drop-shadow-lg">
              {match.team2?.name || "Team 2"}
            </div>
          </div>
        </div>

        {/* Match Details */}
        <div className="flex items-center justify-center gap-8 text-sm text-blue-100">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {new Date(match.matchDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">{match.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMatchCountdown;
