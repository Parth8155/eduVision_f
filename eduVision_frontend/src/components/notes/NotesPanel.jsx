import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import ChatBot from './ChatBot';
import UserNotes from './UserNotes';
import PageNavigation from './PageNavigation';

const NotesPanel = ({
    activeTab,
    onTabChange,
    noteData,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    selectedText,
    onClearSelectedText,
    isCollapsed = false,
    onToggleCollapse
}) => {
    const tabs = ['Notes', 'AI Chat'];

    // Resize functionality with persistence
    const [width, setWidth] = useState(() => {
        const savedWidth = localStorage.getItem('notesPanelWidth');
        return savedWidth ? parseInt(savedWidth, 10) : 320;
    });
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);

    // Save width to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('notesPanelWidth', width.toString());
    }, [width]);

    // Mouse down handler for resize
    const handleMouseDown = useCallback((e) => {
        setIsResizing(true);
        startX.current = e.clientX;
        startWidth.current = width;
        e.preventDefault();
    }, [width]);

    // Mouse move handler for resize
    const handleMouseMove = useCallback((e) => {
        if (!isResizing) return;

        const deltaX = startX.current - e.clientX; // Subtract because we're resizing from the left edge
        const newWidth = Math.max(280, Math.min(600, startWidth.current + deltaX)); // Min 280px, max 600px
        setWidth(newWidth);

        // Update cursor style
        document.body.style.cursor = 'ew-resize';
    }, [isResizing]);

    // Mouse up handler for resize
    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    // Effect for mouse events
    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    // If collapsed, show only the toggle button with animation
    if (isCollapsed) {
        return (
            <div className="relative">
                {/* Collapsed toggle button with animation */}
                <button
                    onClick={onToggleCollapse}
                    className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg shadow-lg p-3 z-50 hover:bg-gray-50 dark:hover:bg-gray-700 interactive-button animate-slideInFromRight"
                    title="Open Notes Panel"
                >
                    <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400 transition-transform duration-200" />
                </button>
            </div>
        );
    }

    return (
        <div
            className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full flex-shrink-0 overflow-hidden rounded-lg relative notes-panel-container notes-panel-expanded`}
            style={{ width: `${width}px` }}
            ref={resizeRef}
        >
            {/* Resize handle */}
            <div
                className={`resize-handle ${isResizing ? 'active' : ''}`}
                onMouseDown={handleMouseDown}
                title="Drag to resize"
            >
            </div>

            {/* Width indicator during resize */}
            {isResizing && (
                <div className="absolute top-2 left-2 bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded text-xs font-mono z-20">
                    {width}px
                </div>
            )}

            {/* Collapse toggle button with animation */}
            <button
                onClick={onToggleCollapse}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 interactive-button"
                title="Close Notes Panel"
            >
                <ChevronRight size={16} className="text-gray-600 dark:text-gray-400 transition-transform duration-200" />
            </button>

            {/* Tab headers with enhanced animations */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 ease-in-out relative ${activeTab === tab
                            ? 'text-black dark:text-white border-b-2 border-black dark:border-white transform scale-105'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        {tab}
                        {/* Active tab indicator */}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform transition-all duration-300 ease-in-out" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content based on active tab with smooth transitions */}
            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
                {activeTab === 'Notes' ? (
                    <div className="flex-1 flex flex-col min-h-0 animate-fadeIn">
                        <div className="flex-1 min-h-0">
                            <UserNotes
                                noteId={noteData?.id || noteData?._id || 'default'}
                                currentPage={currentPage}
                                selectedText={selectedText}
                                onClearSelectedText={onClearSelectedText}
                            />
                        </div>
                        {/* PDF Page Navigation for Notes */}
                        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <PageNavigation
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange || (() => { })}
                            />
                        </div>
                    </div>
                ) : (
                    // AI Chat interface with ChatBot component
                    <div className="flex-1 flex flex-col min-h-0 animate-fadeIn">
                        <div className="flex-1 overflow-hidden">
                            <ChatBot
                                noteData={noteData}
                                isVisible={activeTab === 'AI Chat'}
                                selectedText={selectedText}
                                onClearSelectedText={onClearSelectedText}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesPanel;
