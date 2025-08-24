import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const ThemeToggle = ({ className = '' }) => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkMode ? (
                <Sun size={20} className="text-yellow-500" />
            ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
