import {
  Highlighter,
  Eraser,
  Type,
  Undo,
  Redo,
  Hash,
  MousePointer,
} from "lucide-react";

const DrawingToolbar = ({
  selectedTool,
  selectedColor,
  selectedStyle,
  highlighterColor = "#FFFF00",
  onToolClick,
  onColorChange,
  onStyleChange,
  onHighlighterColorChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onBookmark,
  onAddNote,
}) => {
  // Define tool categories for better organization
  const readingTools = [
    { id: "select", icon: MousePointer, label: "Select/Navigate" },
  ];

  const annotationTools = [
    { id: "highlighter", icon: Highlighter, label: "Highlighter" },
    { id: "number", icon: Hash, label: "Number Annotation" },
    { id: "text", icon: Type, label: "Text Note" },
  ];

  const editingTools = [{ id: "eraser", icon: Eraser, label: "Eraser" }];
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-xl mx-1 p-2 shadow-sm border border-gray-200 dark:border-gray-700">

        {/* Reading Tools */}
        <div className="flex items-center space-x-1">
          {readingTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolClick(tool.id)}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedTool === tool.id
                  ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              title={tool.label}
            >
              <tool.icon size={16} />
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        {/* Annotation Tools */}
        <div className="flex items-center space-x-1">
          {annotationTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === "bookmark" && onBookmark) {
                  onBookmark();
                } else if (tool.id === "sticky-note" && onAddNote) {
                  onAddNote();
                } else {
                  onToolClick(tool.id);
                }
              }}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedTool === tool.id
                  ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              title={tool.label}
            >
              <tool.icon size={16} />
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        {/* Editing Tools */}
        <div className="flex items-center space-x-1">
          {editingTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolClick(tool.id)}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedTool === tool.id
                  ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
              title={tool.label}
            >
              <tool.icon size={16} />
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

        {/* Undo/Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded transition-colors ${
            canUndo
              ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded transition-colors ${
            canRedo
              ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
          title="Redo"
        >
          <Redo size={16} />
        </button>

        {/* Color Palette (only show when annotation tool is selected) */}
        {["highlighter"].includes(selectedTool) && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <div className="flex items-center space-x-1">
              {[
                "#ffff00ff",
                "#ff0000ff",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#FFEAA7",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    if (
                      selectedTool === "highlighter" &&
                      onHighlighterColorChange
                    ) {
                      onHighlighterColorChange(color);
                    } else {
                      onColorChange(color);
                    }
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedTool === "highlighter"
                      ? highlighterColor === color
                        ? "border-gray-600 scale-110"
                        : "border-gray-300"
                      : selectedColor === color
                      ? "border-gray-600 scale-110"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Style Options (only show for drawing tools) */}
        {["pen"].includes(selectedTool) && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onStyleChange("solid")}
                className={`px-3 py-1 text-xs rounded ${
                  selectedStyle === "solid"
                    ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Solid
              </button>
              <button
                onClick={() => onStyleChange("dashed")}
                className={`px-3 py-1 text-xs rounded ${
                  selectedStyle === "dashed"
                    ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Dashed
              </button>
              <button
                onClick={() => onStyleChange("thin")}
                className={`px-3 py-1 text-xs rounded ${
                  selectedStyle === "thin"
                    ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Thin
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DrawingToolbar;
