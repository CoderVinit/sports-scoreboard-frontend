import { Radio, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecentActivity = ({ navigate, liveMatches }) => {
  const match = liveMatches[0];

  return (
    <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl shadow-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Recent Activity
            </h3>
            <p className="text-xs text-gray-600">
              Live match updates
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {match ? (
          <>
            {/* Live Match Card */}
            <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
              {/* Live badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                  LIVE
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  Match #{match.id}
                </span>
              </div>

              {/* Teams */}
              <p className="text-base font-bold text-gray-900 mb-3">
                {match.team1?.name || 'Team 1'}
                <span className="mx-2 text-gray-400 font-normal">vs</span>
                {match.team2?.name || 'Team 2'}
              </p>

              {/* Score */}
              <div className="flex justify-between bg-white p-4 rounded-lg border">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Score</p>
                  <p className="text-lg font-bold text-gray-900">
                    {match.innings?.[0]?.totalRuns || 0}
                    <span className="text-gray-500 font-normal">
                      /{match.innings?.[0]?.totalWickets || 0}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Overs</p>
                  <p className="text-lg font-bold text-gray-900">
                    {match.innings?.[0]?.totalOvers || '0.0'}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full justify-between bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              onClick={() => navigate(`/admin/score-entry/${match.id}`)}
            >
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 animate-pulse" />
                Update Score
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
              <Radio className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">
              No live matches
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Start a match to see live activity here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
