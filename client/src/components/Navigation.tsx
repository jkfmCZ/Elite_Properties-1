import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IconHome, 
  IconBuilding, 
  IconMessageChatbot, 
  IconMoon, 
  IconSun,
  IconLogin,
  IconSettings
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useState, useEffect } from 'react';

export function Navigation() {
  const location = useLocation();
  const [isDark, setIsDark] = useDarkMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const brokerData = localStorage.getItem('brokerData');
    
    if (token && brokerData) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('brokerData');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const navItems = [
    { path: '/', label: 'Home', icon: IconHome },
    { path: '/properties', label: 'Properties', icon: IconBuilding },
    { path: '/chat', label: 'Chat', icon: IconMessageChatbot },
    ...(isAuthenticated ? [{ path: '/admin', label: 'Admin Panel', icon: IconSettings }] : [])
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <IconBuilding className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Elite Properties
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center h-8 space-x-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 hover:from-red-100 hover:to-orange-100 dark:hover:from-gray-700 dark:hover:to-gray-600 border-red-200 dark:border-gray-600 text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
              >
                <IconLogin className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center h-8 space-x-2 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-emerald-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600 border-emerald-200 dark:border-gray-600 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200"
                >
                  <IconLogin className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="relative overflow-hidden h-8 w-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:from-emerald-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-600 border border-emerald-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <motion.div
                initial={false}
                animate={{
                  rotate: isDark ? 180 : 0,
                  scale: isDark ? 1.1 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="relative"
              >
                {isDark ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconSun className="h-5 w-5 text-yellow-500 drop-shadow-sm" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconMoon className="h-5 w-5 text-slate-600 dark:text-slate-300 drop-shadow-sm" />
                  </motion.div>
                )}
              </motion.div>
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-400/20 to-blue-400/20 dark:from-yellow-400/10 dark:to-orange-400/10"
                animate={{
                  opacity: isDark ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Button>
          </motion.div>
          </div>
        </div>
      </div>

      {/* Broker Details Section - All Screen Sizes */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600"
      >
        <div className="w-full max-w-7xl mx-auto">
          {/* Mobile Layout - Stack vertically */}
          <div className="sm:hidden">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative flex-shrink-0">
                <img 
                  src="/images/broker/broker.png" 
                  alt="Janek Krupička" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  Janek Krupička
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Senior Real Estate Broker
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +1 123 456 7890
                </p>
              </div>
            </div>
            
            {/* Mobile Stats Row */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300 font-medium flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></span>
                12+ Years Experience
              </span>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                ★ 4.9 (150 reviews)
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Layout - Side by side */}
          <div className="hidden sm:flex items-center justify-between">
            {/* Broker Info */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="relative">
                <img 
                  src="/images/broker/broker.png" 
                  alt="Janek Krupička" 
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-3 border-emerald-400 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white dark:border-gray-800 shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Janek Krupička
                </h3>
                <p className="text-base lg:text-lg text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                  Senior Real Estate Broker
                </p>
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <span className="text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    12+ Years Experience
                  </span>
                  <span className="text-sm lg:text-base text-yellow-600 dark:text-yellow-400 font-semibold flex items-center">
                    ★ 4.9 <span className="text-gray-500 dark:text-gray-400 ml-1">(150 reviews)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info - Hidden on small mobile */}
            <div className="flex items-center space-x-8 lg:space-x-12">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-1">Direct Line</p>
                <p className="text-base lg:text-lg font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer">
                  +1 123 456 7890
                </p>
              </div>
              <div className="text-right min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-1">Email Contact</p>
                <p className="text-sm lg:text-base font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer">
                  janek.krupicka@eliteproperties.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-2 py-1 text-xs ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}