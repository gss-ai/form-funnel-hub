
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Home, BarChart3, Users, PlusCircle, User, LogOut, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      await logout();
      toast.success('Logged out successfully');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SurvEase
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600"
              />
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                    size="sm" 
                    className="flex items-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Link to="/feed">
                  <Button 
                    variant={isActive('/feed') ? 'default' : 'ghost'} 
                    size="sm" 
                    className="flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Feed</span>
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button 
                    variant={isActive('/leaderboard') ? 'default' : 'ghost'} 
                    size="sm" 
                    className="flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Leaderboard</span>
                  </Button>
                </Link>
                <Link to="/post-form">
                  <Button 
                    variant={isActive('/post-form') ? 'default' : 'ghost'} 
                    size="sm" 
                    className="flex items-center space-x-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Form</span>
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button 
                    variant={isActive('/profile') ? 'default' : 'ghost'} 
                    size="sm" 
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
