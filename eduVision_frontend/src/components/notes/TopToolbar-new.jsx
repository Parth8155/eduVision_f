import React from 'react';
import { ChevronRight, Save, Download } from 'lucide-react';

const TopToolbar = ({ onSave, onExport, isSaving = false, hasUnsavedChanges = false }) => {
    return (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
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
                <button 
                    onClick={onExport}
                    className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
                >
                    <Download size={14} />
                    <span>Export</span>
                </button>
                <div className="relative">
                    <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1">
                        <span>Edit</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
                <div className="relative">
                    <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1">
                        <span>View</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
                <button className="px-4 py-1 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Summary
                </button>
            </div>
        </div>
    );
};

export default TopToolbar;
