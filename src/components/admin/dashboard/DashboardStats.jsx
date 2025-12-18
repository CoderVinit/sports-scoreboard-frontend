import { Trophy, Radio, Users, User } from 'lucide-react';
import StatCard from './StatCard';

const DashboardStats = ({ stats }) => {
  const cards = [
    { title: 'Total Matches', value: stats.totalMatches, icon: Trophy, gradient: 'from-blue-600 to-blue-700' },
    { title: 'Live Matches', value: stats.liveMatches, icon: Radio, gradient: 'from-red-600 to-pink-600', pulse: true },
    { title: 'Total Teams', value: stats.totalTeams, icon: Users, gradient: 'from-green-600 to-emerald-600' },
    { title: 'Total Players', value: stats.totalPlayers, icon: User, gradient: 'from-amber-600 to-orange-600' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  );
};

export default DashboardStats;
