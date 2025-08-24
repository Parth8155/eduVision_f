import { useState, useCallback, useEffect, useRef } from "react";
import TopToolbar from "./TopToolbar";
import ContentView from "./ContentView";

const ContentArea = ({
  pdfUrl,
  onLoadSuccess,
  onLoadError,
  currentPage = 4,
  onTextSelection,
  onCreateNumberAnnotation,
  noteId, // Add noteId prop
  onSave, // Add save callback
  onExport, // Add export callback
}) => {
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("#4ECDC4");
  const [selectedStyle, setSelectedStyle] = useState("solid");
  const [highlighterColor, setHighlighterColor] = useState("#FFFF00");
  const [activeSubTool, setActiveSubTool] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [studyModeEnabled, setStudyModeEnabled] = useState(false);
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const saveAnnotationsRef = useRef(null);

  useEffect(() => {
    try {
      // Only disable selection for annotation tools, NOT for reading tools
      const isAnnotationTool = ["highlighter", "pen", "number", "text", "eraser"].includes(selectedTool);
      
      if (isAnnotationTool) {
        console.log("🔒 Disabling text selection - tool:", selectedTool);
        document.body.classList.add("edu-no-select");
      } else {
        console.log("🔓 Enabling text selection - tool:", selectedTool);
        document.body.classList.remove("edu-no-select");
      }
    } catch (e) {
      // ignore in non-browser environments
    }
    return () => {
      try {
        document.body.classList.remove("edu-no-select");
      } catch (e) {}
    };
  }, [selectedTool]);

  // Editing command state - this replaces direct tool passing
  const [editingCommand, setEditingCommand] = useState(null);

  // Debug: trace selectedTool and editingCommand changes
  useEffect(() => {
    console.log("ContentArea.selectedTool =>", selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    console.log("ContentArea.editingCommand =>", editingCommand);
  }, [editingCommand]);

  const handleToolClick = (toolId) => {
    // Handle special actions
    if (toolId === "clear-all") {
      setEditingCommand({
        action: "clear-all",
        tool: "clear",
        data: {},
      });
      return;
    }

    // Handle direct action tools
    if (toolId === "search") {
      setEditingCommand({
        action: "search",
        tool: "search",
        data: {},
      });
      return;
    }

    if (toolId === "bookmark") {
      setEditingCommand({
        action: "bookmark",
        tool: "bookmark",
        data: { page: currentPage },
      });
      return;
    }

    if (toolId === "sticky-note") {
      setEditingCommand({
        action: "add-note",
        tool: "note",
        data: {},
      });
      return;
    }

    // Toggle logic for drawing/annotation tools
    if (selectedTool === toolId && activeSubTool === toolId) {
      setActiveSubTool(null);
      setSelectedTool("select");
      setEditingCommand({
        action: "activate-tool",
        tool: "select",
        color: selectedColor,
        style: selectedStyle,
      });
    } else {
      setSelectedTool(toolId);
      setActiveSubTool(toolId);
      setEditingCommand({
        action: "activate-tool",
        tool: toolId,
        color: toolId === "highlighter" ? highlighterColor : selectedColor,
        style: selectedStyle,
      });
    }
  };

  const handleToggleStudyMode = useCallback(() => {
    setStudyModeEnabled((prev) => !prev);
    setEditingCommand({
      action: "toggle-study-mode",
      tool: "study-mode",
      data: { enabled: !studyModeEnabled },
    });
  }, [studyModeEnabled]);

  const handleToggleViewMode = useCallback(() => {
    setViewModeEnabled((prev) => !prev);
    setEditingCommand({
      action: "toggle-view-mode",
      tool: "view-mode",
      data: { enabled: !viewModeEnabled },
    });
  }, [viewModeEnabled]);

  const handleBookmark = useCallback(() => {
    setEditingCommand({
      action: "bookmark",
      tool: "bookmark",
      data: { page: currentPage },
    });
    console.log("Bookmark added for page:", currentPage);
  }, [currentPage]);

  const handleSearch = useCallback(() => {
    setEditingCommand({
      action: "search",
      tool: "search",
      data: {},
    });
    console.log("Search triggered");
  }, []);

  const handleAddNote = useCallback(() => {
    setEditingCommand({
      action: "add-note",
      tool: "note",
      data: {},
    });
    console.log("Add note triggered");
  }, []);

  // Color and style change handlers
  const handleColorChange = useCallback(
    (color) => {
      setSelectedColor(color);
      setEditingCommand({
        action: "change-color",
        tool: selectedTool,
        color: color,
        style: selectedStyle,
      });
    },
    [selectedTool, selectedStyle]
  );

  const handleStyleChange = useCallback(
    (style) => {
      setSelectedStyle(style);
      setEditingCommand({
        action: "change-style",
        tool: selectedTool,
        color: selectedColor,
        style: style,
      });
    },
    [selectedTool, selectedColor]
  );

  const handleHighlighterColorChange = useCallback(
    (color) => {
      setHighlighterColor(color);
      setEditingCommand({
        action: "change-highlighter-color",
        tool: "highlighter",
        color: color,
        style: selectedStyle,
      });
    },
    [selectedStyle]
  );

  // Memoize the text selection handler to prevent re-renders
  const handleTextSelection = useCallback(
    (selection) => {
      if (onTextSelection) {
        onTextSelection(selection);
      }
    },
    [onTextSelection]
  );

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    setEditingCommand({
      action: "undo",
      tool: "undo",
      data: {},
    });
  }, []);

  const handleRedo = useCallback(() => {
    setEditingCommand({
      action: "redo",
      tool: "redo",
      data: {},
    });
  }, []);

  // Listen for undo/redo state changes from PDF viewer
  useEffect(() => {
    const checkUndoRedoState = () => {
      // These would be set by the PDF viewer component
      setCanUndo(window.canUndoPDF || false);
      setCanRedo(window.canRedoPDF || false);
    };

    const interval = setInterval(checkUndoRedoState, 200);
    return () => clearInterval(interval);
  }, []);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!saveAnnotationsRef.current || isSaving) return;

    setIsSaving(true);
    try {
      const success = await saveAnnotationsRef.current();
      if (success) {
        setHasUnsavedChanges(false);
        if (onSave) {
          onSave();
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  // Export handler
  const handleExport = useCallback(() => {
    if (onExport) {
      onExport();
    }
  }, [onExport]);

  // Handle annotations change callback
  const handleAnnotationsChange = useCallback((annotations) => {
    setHasUnsavedChanges(false); // Just saved, so no unsaved changes
  }, []);

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col min-w-0 overflow-hidden">
      {/* Top toolbar with integrated drawing tools */}
      <div className="flex-shrink-0">
        <TopToolbar 
          onSave={handleSave}
          onExport={handleExport}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          // DrawingToolbar props
          selectedTool={selectedTool}
          selectedColor={selectedColor}
          selectedStyle={selectedStyle}
          highlighterColor={highlighterColor}
          onToolClick={handleToolClick}
          onColorChange={handleColorChange}
          onStyleChange={handleStyleChange}
          onHighlighterColorChange={handleHighlighterColorChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onToggleStudyMode={handleToggleStudyMode}
          studyModeEnabled={studyModeEnabled}
          onBookmark={handleBookmark}
          onAddNote={handleAddNote}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden border mx-1 rounded-xl min-h-0">
        <div className="h-full">
          <ContentView
            pdfUrl={pdfUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            currentPage={currentPage}
            editingCommand={editingCommand}
            onTextSelection={handleTextSelection}
            onCreateNumberAnnotation={onCreateNumberAnnotation}
            onCommandProcessed={() => setEditingCommand(null)}
            noteId={noteId}
            onSaveFunction={(saveFunc) => { saveAnnotationsRef.current = saveFunc; }}
            onAnnotationsChange={handleAnnotationsChange}
            onUnsavedChanges={setHasUnsavedChanges}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
