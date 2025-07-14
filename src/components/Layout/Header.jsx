import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Github, 
  Moon, 
  Sun, 
  Monitor, 
  Menu, 
  X,
  GitBranch
} from 'lucide-react';
import useThemeStore from '../../stores/themeStore';

const Header = () => {
  const { theme, setTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Theme to document
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if(isDark){
      document.documentElement.classList.add('dark');
    } 
    else{
      document.documentElement.classList.remove('dark');
    }
  },[theme]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/${searchQuery.trim()}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <GitBranch className="h-6 w-6" />
            <span className="text-xl font-semibold">GitViz</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full ${
                theme === 'light'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Light mode"
            >
              <Sun className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Dark mode"
            >
              <Moon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-2 rounded-full ${
                theme === 'system'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="System preference"
            >
              <Monitor className="h-5 w-5" />
            </button>
          </div>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-3 shadow-lg animate-slide-down">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex justify-between mb-4">
            <button
              onClick={() => {
                setTheme('light');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                setTheme('dark');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => {
                setTheme('system');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                theme === 'system'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span>System</span>
            </button>
          </div>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
