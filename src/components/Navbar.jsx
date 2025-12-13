import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Tv, Shield, LogIn, UserPlus, LogOut, Menu as MenuIcon, Trophy } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-blue-700 bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="w-full">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <Trophy className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-xl leading-tight">
                CricScore
              </span>
              <span className="text-xs text-blue-100 leading-tight">
                Live Cricket Updates
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 flex-1 ml-8">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-white gap-2 font-medium",
                  isActive('/') ? "bg-white/20 hover:bg-white/25" : "hover:bg-white/10"
                )}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            
            <Link to="/live">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-white gap-2 font-medium",
                  isActive('/live') ? "bg-white/20 hover:bg-white/25" : "hover:bg-white/10"
                )}
              >
                <Tv className="h-4 w-4" />
                <span>Live Matches</span>
              </Button>
            </Link>
            
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-white gap-2 font-medium",
                    isActive('/admin') ? "bg-white/20 hover:bg-white/25" : "hover:bg-white/10"
                  )}
                >
                  <Shield className="h-4 w-4" />
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
                  className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
                >
                  <Avatar className="h-9 w-9 bg-white/20 border-2 border-white/30">
                    <AvatarFallback className="bg-white text-blue-600 font-bold text-base">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
                
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-xl z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-11 w-11 border-2 border-blue-600">
                            <AvatarFallback className="bg-blue-600 text-white font-bold text-lg">
                              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900">{user?.username || 'User'}</p>
                            {isAdmin && (
                              <Badge className="mt-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
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
                    className="text-white gap-2 font-medium hover:bg-white/10 border border-white/20"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md"
                  >
                    <UserPlus className="h-4 w-4" />
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
