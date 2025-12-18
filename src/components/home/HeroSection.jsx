import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <Card className="mb-12 border-none bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl overflow-hidden rounded-xl relative">
      <CardContent className="p-8 md:p-16 text-center relative z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mt-48 -mr-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl -mb-40 -ml-40 animate-pulse delay-1000"></div>
        <div className="relative z-10">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30 shadow-xl">
            <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Live Cricket Scoreboard
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience real-time match updates, comprehensive statistics,
            and thrilling cricket action
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;
