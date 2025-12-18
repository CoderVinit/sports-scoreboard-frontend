import { Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LivePageHeader = ({ matchCount }) => {
  return (
    <Card className="mb-12 border-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mt-48 -mr-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -mb-40 -ml-40 animate-pulse delay-1000"></div>
      <CardContent className="p-8 md:p-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl">
            <Radio className="w-12 h-12 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Live Cricket Matches
            </h1>
            <p className="text-xl text-blue-50 font-medium">
              {matchCount} {matchCount === 1 ? 'match' : 'matches'} in progress
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePageHeader;
