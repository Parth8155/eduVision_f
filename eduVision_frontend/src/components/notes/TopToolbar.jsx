import React from 'react';
import { Save } from 'lucide-react';
import DrawingToolbar from './DrawingToolbar';

const TopToolbar = ({ 
    onSave, 
    onExport, 
    isSaving = false, 
    hasUnsavedChanges = false,
    // DrawingToolbar props
    selectedTool,
    selectedColor,
    selectedStyle,
    highlighterColor,
    onToolClick,
    onColorChange,
    onStyleChange,
    onHighlighterColorChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onToggleStudyMode,
    studyModeEnabled,
    onBookmark,
    onAddNote,
}) => {
    return (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
            {/* Left side - Save button */}
            <div className="flex items-center space-x-4">
                <button 
                    onClick={onSave}
                    disabled={isSaving}
                    className={`px-4 py-1 rounded transition-colors flex items-center space-x-1 ${
                        hasUnsavedChanges 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    {hasUnsavedChanges && <span className="w-2 h-2 bg-blue-500 rounded-full ml-1"></span>}
                </button>
            </div>

            {/* Center - Drawing Toolbar */}
            <div className="flex-1 flex justify-center">
                <DrawingToolbar
                    selectedTool={selectedTool}
                    selectedColor={selectedColor}
                    selectedStyle={selectedStyle}
                    highlighterColor={highlighterColor}
                    onToolClick={onToolClick}
                    onColorChange={onColorChange}
                    onStyleChange={onStyleChange}
                    onHighlighterColorChange={onHighlighterColorChange}
                    onUndo={onUndo}
                    onRedo={onRedo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onToggleStudyMode={onToggleStudyMode}
                    studyModeEnabled={studyModeEnabled}
                    onBookmark={onBookmark}
                    onAddNote={onAddNote}
                />
            </div>
        </div>
    );
};

export default TopToolbar;
