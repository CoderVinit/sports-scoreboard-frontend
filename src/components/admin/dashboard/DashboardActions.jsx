import { Radio, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DashboardActions = ({ navigate, liveMatches }) => {
  return (
    <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Quick Actions
            </h3>
            <p className="text-xs text-gray-600">
              Manage matches, teams & players
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-3">
        {/* Primary */}
        <Button
          size="lg"
          className="w-full justify-between bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          onClick={() => navigate('/admin/matches')}
        >
          <span>Manage Matches</span>
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Live */}
        <Button
          size="lg"
          disabled={!liveMatches.length}
          onClick={() =>
            navigate(`/admin/score-entry/${liveMatches[0]?.id}`)
          }
          className="
            w-full justify-between
            bg-gradient-to-r from-red-600 to-pink-600
            hover:from-red-700 hover:to-pink-700
            text-white shadow-lg
            disabled:opacity-50
          "
        >
          <span className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse" />
            Live Score Entry
          </span>
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Secondary */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="h-12 font-semibold"
            onClick={() => navigate('/admin/teams')}
          >
            Manage Teams
          </Button>
          <Button
            variant="outline"
            className="h-12 font-semibold"
            onClick={() => navigate('/admin/players')}
          >
            Manage Players
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActions;
