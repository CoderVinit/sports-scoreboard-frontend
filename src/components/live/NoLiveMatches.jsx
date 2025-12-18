import { Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const NoLiveMatches = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mt-48 -mr-48 animate-pulse"></div>
        <CardContent className="p-12 text-center relative z-10">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30 shadow-xl">
            <Radio className="w-16 h-16 text-white animate-pulse" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            No Live Matches
          </h2>
          <p className="text-xl text-blue-50 font-medium">
            Check back later for live cricket action!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoLiveMatches;
