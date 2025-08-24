import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit3, Trash2, Save, X, Search, Clock } from "lucide-react";
import userNotesService from "../../services/userNotesService";
import { Button } from "../ui/button";

const UserNotes = ({
  noteId,
  currentPage,
  selectedText,
  onClearSelectedText,
}) => {
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "#fbbf24", // Default yellow color
    tags: [],
    selectedText: "",
  });

  const colors = [
    { name: "Yellow", value: "#fbbf24" },
    { name: "Blue", value: "#60a5fa" },
    { name: "Green", value: "#34d399" },
    { name: "Pink", value: "#f472b6" },
    { name: "Purple", value: "#a78bfa" },
    { name: "Red", value: "#f87171" },
  ];

  // Load notes for current page
  const loadNotesForPage = useCallback(async () => {
    if (!noteId) return;

    try {
      setIsLoading(true);
      const pageNotes = await userNotesService.getNotesForPage(
        noteId,
        currentPage
      );
      setNotes(pageNotes);
    } catch (error) {
      console.error("Failed to load notes for page:", error);
    } finally {
      setIsLoading(false);
    }
  }, [noteId, currentPage]);

  // Load all notes for search
  const loadAllNotes = useCallback(async () => {
    if (!noteId) return;

    try {
      const allUserNotes = await userNotesService.getAllNotesForNote(noteId);
      setAllNotes(allUserNotes);
    } catch (error) {
      console.error("Failed to load all notes:", error);
    }
  }, [noteId]);

  useEffect(() => {
    loadNotesForPage();
    loadAllNotes();
  }, [loadNotesForPage, loadAllNotes]);

  // Auto-fill from selected text
  useEffect(() => {
    if (
      selectedText &&
      selectedText.pageNumber === currentPage &&
      !isCreating
    ) {
      setNewNote((prev) => ({
        ...prev,
        selectedText: selectedText.text,
        title:
          selectedText.text.slice(0, 50) +
          (selectedText.text.length > 50 ? "..." : ""),
        content: `Selected text: "${selectedText.text}"\n\nMy notes:\n`,
      }));
      setIsCreating(true);
    }
  }, [selectedText, currentPage, isCreating]);

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      return;
    }

    try {
      const noteData = {
        noteId,
        pageNumber: currentPage,
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        color: newNote.color,
        tags: newNote.tags,
        selectedText: newNote.selectedText || undefined,
      };

      const createdNote = await userNotesService.createNote(noteData);
      setNotes((prev) => [createdNote, ...prev]);
      setAllNotes((prev) => [createdNote, ...prev]);

      // Reset form
      setNewNote({
        title: "",
        content: "",
        color: "#fbbf24",
        tags: [],
        selectedText: "",
      });
      setIsCreating(false);

      // Clear selected text
      if (onClearSelectedText) {
        onClearSelectedText();
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleUpdateNote = async (noteId, updateData) => {
    try {
      const updatedNote = await userNotesService.updateNote(noteId, updateData);
      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note))
      );
      setAllNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note))
      );
      setEditingNoteId(null);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await userNotesService.deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setAllNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const filteredNotes = searchQuery
    ? allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-black dark:text-white">
              My Notes {!searchQuery && `- Page ${currentPage}`}
            </h3>
            {filteredNotes.length > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"}
              </span>
            )}
          </div>
          <Button
            onClick={() => {
              setIsCreating(true);
              if (selectedText && selectedText.pageNumber === currentPage) {
                setNewNote((prev) => ({
                  ...prev,
                  selectedText: selectedText.text,
                }));
              }
            }}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Note
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search all notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selected text indicator */}
        {selectedText && selectedText.pageNumber === currentPage && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Text selected from page {selectedText.pageNumber}
              </span>
              <button
                onClick={onClearSelectedText}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                title="Clear selected text"
                aria-label="Clear selected text"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 line-clamp-2">
              "{selectedText.text}"
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Create Note Form */}
        {isCreating && (
          <div className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              {/* Color picker */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Color:
                </span>
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setNewNote((prev) => ({ ...prev, color: color.value }))
                    }
                    className={`w-6 h-6 rounded-full border-2 ${
                      newNote.color === color.value
                        ? "border-gray-800 dark:border-white"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNote({
                      title: "",
                      content: "",
                      color: "#fbbf24",
                      tags: [],
                      selectedText: "",
                    });
                    if (onClearSelectedText) {
                      onClearSelectedText();
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNote}
                  size="sm"
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              Loading notes...
            </span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {searchQuery
                ? "No notes found for your search"
                : `No notes for page ${currentPage} yet`}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              {searchQuery
                ? "Try a different search term"
                : 'Click "Add Note" to create your first note'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                isEditing={editingNoteId === note._id}
                onEdit={() => setEditingNoteId(note._id)}
                onCancelEdit={() => setEditingNoteId(null)}
                onUpdate={(updateData) =>
                  handleUpdateNote(note._id, updateData)
                }
                onDelete={() => handleDeleteNote(note._id)}
                formatTime={formatTime}
                colors={colors}
                showPageNumber={!!searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Note Card Component
const NoteCard = ({
  note,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  formatTime,
  colors,
  showPageNumber,
}) => {
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content,
    color: note.color || "#fbbf24",
  });

  const handleSave = () => {
    onUpdate(editData);
  };

  if (isEditing) {
    return (
      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Note title"
            aria-label="Edit note title"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={editData.content}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={4}
            placeholder="Note content"
            aria-label="Edit note content"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Color:
            </span>
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  setEditData((prev) => ({ ...prev, color: color.value }))
                }
                className={`w-5 h-5 rounded-full border-2 ${
                  editData.color === color.value
                    ? "border-gray-800 dark:border-white"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                style={{ backgroundColor: color.value }}
                title={`Select ${color.name} color`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={onCancelEdit} variant="outline" size="sm">
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-3 border-l-4 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftColor: note.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {note.title}
            </h4>
            {showPageNumber && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                Page {note.pageNumber}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
            {note.content}
          </p>

          {note.selectedText && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded mb-2">
              <span className="font-medium">Referenced text:</span> "
              {note.selectedText}"
            </div>
          )}

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(note.updatedAt)}
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit note"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotes;
