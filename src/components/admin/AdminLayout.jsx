import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Trophy, Users, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const adminNavItems = [
  { label: 'Overview', path: '/admin', icon: BarChart3 },
  { label: 'Matches', path: '/admin/matches', icon: Trophy },
  { label: 'Teams', path: '/admin/teams', icon: Users },
  { label: 'Players', path: '/admin/players', icon: User },
];

const AdminLayout = ({ title, subtitle, children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer exact path match; fall back to prefix match for nested routes
  let currentTab = adminNavItems.findIndex(item => location.pathname === item.path);
  if (currentTab === -1) {
    currentTab = adminNavItems.findIndex(item => location.pathname.startsWith(item.path));
  }

  const handleChange = (value) => {
    const item = adminNavItems.find(item => item.label === value);
    if (item && location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  const getCurrentTabValue = () => {
    if (currentTab === -1) return 'Overview';
    return adminNavItems[currentTab].label;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-32 -mr-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mb-24 -ml-24"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Premium Tabs with Icons */}
          <Tabs value={getCurrentTabValue()} onValueChange={handleChange} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl p-1.5 border border-gray-200 h-auto min-h-[56px]">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = getCurrentTabValue() === item.label;
                return (
                  <TabsTrigger 
                    key={item.path} 
                    value={item.label}
                    onClick={() => {
                      if (location.pathname !== item.path) {
                        navigate(item.path);
                      }
                    }}
                    className={`
                      relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm min-h-[48px] w-full cursor-pointer
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                        : 'text-gray-700 bg-transparent hover:text-blue-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full"></div>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
