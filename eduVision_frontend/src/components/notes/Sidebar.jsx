import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  MessageCircle,
  Star,
  ArrowLeft,
  Download,
  Share,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const Sidebar = ({
  collapsed,
  onToggle,
  noteData,
  onBack,
  onDownload,
  onShare,
}) => {
  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Plus, label: "Create a space" },
    { icon: MessageCircle, label: "Contact us" },
    { icon: Star, label: "Rate us" },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 overflow-hidden ${
        collapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 min-h-[60px]">
        {!collapsed && (
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white dark:text-black font-bold text-sm">
                S
              </span>
            </div>
            <span className="font-semibold text-black dark:text-white truncate">
              eduVision{" "}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          {!collapsed && <ThemeToggle />}
          <div className="flex items-center justify-center h-8 flex-shrink-0">
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center w-8 h-8"
            >
              {collapsed ? (
                <ChevronRight
                  size={16}
                  className="text-gray-600 dark:text-gray-400"
                />
              ) : (
                <ChevronLeft
                  size={16}
                  className="text-gray-600 dark:text-gray-400"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Note-taking button */}
      {!collapsed && (
        <div className="p-2">
          {noteData ? (
            <button
              onClick={onBack}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-1 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Library</span>
            </button>
          ) : (
            <button className="w-full bg-black dark:bg-white text-white dark:text-black py-1 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              <Plus size={16} />
              <span>Note-taking</span>
            </button>
          )}
        </div>
      )}

      {/* Current Note Section */}
      {noteData && !collapsed && (
        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Current Note
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-black dark:bg-white rounded-full"></div>
              <span className="text-sm font-medium text-black dark:text-white truncate">
                {noteData.title}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
              {noteData.subject} • {noteData.type}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={onDownload}
                className="flex-1 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
              <button
                onClick={onShare}
                className="flex-1 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1"
              >
                <Share size={12} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1">
        <div className="px-4 py-2">
          {!collapsed && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Navigation
            </span>
          )}
        </div>
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  item.active
                    ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <item.icon size={16} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>

        {/* Theme toggle for collapsed sidebar */}
        {collapsed && (
          <div className="px-2 py-4">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        )}
      </nav>

      {/* Spaces section */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Spaces
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              StudyAI Demo
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Inbox
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
