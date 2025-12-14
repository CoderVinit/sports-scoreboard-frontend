import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Tv, Shield, LogIn, UserPlus, LogOut, Trophy } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-gray-300 bg-white shadow-md">
      <div className="w-full">
        <div className="flex h-20 items-center justify-between px-8 max-w-[1600px] mx-auto">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-4 text-gray-900 hover:text-blue-800 transition-colors duration-200"
          >
            <div className="p-2.5 bg-blue-900 rounded-lg shadow-md">
              <Trophy className="w-7 h-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl leading-tight tracking-tight text-gray-900">
                CricScore
              </span>
              <span className="text-xs text-gray-600 leading-tight font-medium uppercase tracking-wider">
                Live Cricket Updates
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 flex-1 ml-12 max-w-2xl">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 font-semibold text-base px-5 py-5 rounded-md transition-colors duration-200",
                  isActive('/') 
                    ? "bg-blue-900 text-white hover:bg-blue-800" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Home className="h-4 w-4" strokeWidth={2} />
                <span>Home</span>
              </Button>
            </Link>
            
            <Link to="/live">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 font-semibold text-base px-5 py-5 rounded-md transition-colors duration-200",
                  isActive('/live') 
                    ? "bg-blue-900 text-white hover:bg-blue-800" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Tv className="h-4 w-4" strokeWidth={2} />
                <span>Live Matches</span>
              </Button>
            </Link>
            
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 font-semibold text-base px-5 py-5 rounded-md transition-colors duration-200",
                    isActive('/admin') 
                      ? "bg-blue-900 text-white hover:bg-blue-800" 
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Shield className="h-4 w-4" strokeWidth={2} />
                  <span>Admin</span>
                </Button>
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Avatar className="h-9 w-9 bg-blue-900 border border-gray-300">
                    <AvatarFallback className="bg-blue-900 text-white font-bold text-sm">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900 font-semibold text-sm">
                    {user?.username || 'User'}
                  </span>
                </button>
                
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-300 bg-white shadow-xl z-50">
                      {/* Menu Header */}
                      <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 bg-blue-900 border-2 border-blue-900">
                            <AvatarFallback className="bg-blue-900 text-white font-bold text-lg">
                              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-bold text-base text-gray-900">{user?.username || 'User'}</p>
                            {isAdmin && (
                              <Badge className="mt-1.5 text-xs bg-blue-900 text-white hover:bg-blue-800 border-none font-semibold px-2.5 py-0.5">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4" strokeWidth={2} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 font-semibold text-base px-5 py-5 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 transition-colors duration-200"
                  >
                    <LogIn className="h-4 w-4" strokeWidth={2} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="gap-2 px-5 py-5 font-semibold text-base bg-blue-900 hover:bg-blue-800 text-white rounded-md shadow-sm border border-blue-900 transition-colors duration-200"
                  >
                    <UserPlus className="h-4 w-4" strokeWidth={2} />
                    <span>Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;