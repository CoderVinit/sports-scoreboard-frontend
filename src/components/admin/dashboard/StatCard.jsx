import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient, pulse }) => {
  return (
    <Card className={`bg-gradient-to-br ${gradient} text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden`}>
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <h3 className="text-4xl font-bold mt-1">{value}</h3>
            <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
              {pulse && <TrendingUp className="w-3 h-3 animate-pulse" />}
              <span>Overview</span>
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Icon className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
