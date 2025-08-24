import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, Bell, Settings, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ui/ThemeToggle";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data from localStorage or API
  useEffect(() => {
    const getUserData = () => {
      try {
        // First try to get from localStorage (if stored during login)
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUserName(user.name || user.firstName || user.email?.split('@')[0] || "User");
            return;
          } catch (parseError) {
            console.warn('Failed to parse userData from localStorage:', parseError);
          }
        }

        // Alternatively, get from token payload
        const token = localStorage.getItem('accessToken');
        if (token && typeof token === 'string' && token.includes('.')) {
          try {
            // Decode JWT payload (basic decode without verification)
            const parts = token.split('.');
            if (parts.length === 3) {
              // Safely decode the payload
              const payload = JSON.parse(atob(parts[1]));
              setUserName(payload.name || payload.firstName || payload.email?.split('@')[0] || "User");
            }
          } catch (decodeError) {
            console.warn('Failed to decode token:', decodeError);
          }
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      } finally {
        // Always set a fallback name
        setUserName(prevName => prevName || "User");
      }
    };

    getUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.relative')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Handle logout
  const handleLogout = () => {
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if cleanup fails
      navigate('/login');
    }
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: location.pathname === "/dashboard",
    },
    {
      name: "Upload Notes",
      href: "/upload",
      current: location.pathname === "/upload",
    },
    {
      name: "Study Tools",
      href: "/study-tools",
      current: location.pathname === "/study-tools",
    },
    {
      name: "Library",
      href: "/library",
      current: location.pathname === "/library",
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-bold text-black dark:text-white">
              eduVision
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white dark:text-black" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userName}
                </span>
              </Button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-medium">{userName}</div>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.current
                      ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
