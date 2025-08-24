import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Folder,
  FileText,
  Calendar,
  MoreHorizontal,
  Star,
  Download,
  Share,
  Eye,
  BookOpen,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import notesService from "@/services/notesService";
import studyToolsService from "@/services/studyToolsService";

const ContextMenu = ({
  item,
  x,
  y,
  onClose,
  onOpenNewTab,
  onOpenSameTab,
  onToggleStar,
  onDelete,
  onGenerateMCQ,
  onGenerateSummary,
  generatingContent,
}) => {
  return (
    <div
      className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 z-50"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200"
        onClick={() => {
          onOpenSameTab(item);
          onClose();
        }}
      >
        Open in current tab
      </button>
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200"
        onClick={() => {
          onOpenNewTab(item);
          onClose();
        }}
      >
        Open in new tab
      </button>
      <hr className="my-1 border-gray-200 dark:border-gray-600" />
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center dark:text-gray-200"
        onClick={() => {
          onToggleStar(item);
          onClose();
        }}
      >
        <Star
          className={`w-4 h-4 mr-2 ${
            item.starred ? "fill-current text-yellow-500" : ""
          }`}
        />
        {item.starred ? "Remove from starred" : "Add to starred"}
      </button>
      <hr className="my-1 border-gray-200 dark:border-gray-600" />
      {!item.isStudyMaterial && (
        <>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              onGenerateMCQ(item);
              onClose();
            }}
            disabled={generatingContent?.noteId === item._id && generatingContent?.type === 'mcq'}
          >
            {generatingContent?.noteId === item._id && generatingContent?.type === 'mcq' ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Generate MCQs
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              onGenerateSummary(item);
              onClose();
            }}
            disabled={generatingContent?.noteId === item._id && generatingContent?.type === 'summary'}
          >
            {generatingContent?.noteId === item._id && generatingContent?.type === 'summary' ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BookOpen className="w-4 h-4 mr-2" />
            )}
            Generate Summary
          </button>
          <hr className="my-1 border-gray-200 dark:border-gray-600" />
        </>
      )}
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400"
        onClick={() => {
          onDelete(item);
          onClose();
        }}
      >
        Delete note
      </button>
    </div>
  );
};

// Loading skeleton component
const LoadingSkeleton = ({ viewMode }) => {
  const skeletonCount = viewMode === "grid" ? 6 : 5;

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Card
          key={index}
          className="animate-pulse dark:bg-gray-800 dark:border-gray-700"
        >
          {viewMode === "grid" ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
              </CardHeader>
              <CardContent>
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="flex space-x-2 mb-3">
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center space-x-4 p-4">
              <div className="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="flex space-x-2">
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="w-20 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

const Library = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  // API State
  const [notes, setNotes] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotes: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [subjects, setSubjects] = useState([]);
  const [folders, setFolders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(null);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Check if user is authenticated
  useEffect(() => {
    const token = notesService.getAuthToken();
    if (!token) {
      toast.error("Please login to access your library");
      navigate("/login");
      return;
    }

    loadUserData();
  }, [navigate]);

  // Load user data (notes, subjects, folders)
  const loadUserData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadNotes(), loadStudyMaterials(), loadSubjects(), loadFolders()]);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load library data");
    } finally {
      setLoading(false);
    }
  };

  // Load user's notes with current filters
  const loadNotes = async (page = currentPage) => {
    try {
      const params = {
        page,
        limit: 12,
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedFilter !== "all" &&
          selectedFilter !== "starred" &&
          selectedFilter !== "recent" && { type: selectedFilter }),
      };

      const response = await notesService.getUserNotes(params);
      setNotes(response.data.notes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error loading notes:", error);
      toast.error("Failed to load notes");
    }
  };

  // Load user's study materials
  const loadStudyMaterials = async () => {
    try {
      const params = {
        limit: 100, // Load more study materials
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      const response = await studyToolsService.getUserStudyMaterials(params);
      setStudyMaterials(response.data.studyMaterials || []);
    } catch (error) {
      console.error("Error loading study materials:", error);
      // Don't show error toast for study materials as they're optional
    }
  };

  // Load user's subjects
  const loadSubjects = async () => {
    try {
      const response = await notesService.getUserSubjects();
      setSubjects(response.data.subjects);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  // Load user's folders
  const loadFolders = async () => {
    try {
      const response = await notesService.getUserFolders();
      setFolders(response.data.folders);
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
    toast.success("Library refreshed");
  };

  // Search and filter effects
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        loadNotes(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedFilter, selectedSubject, selectedFolder, sortBy, sortOrder]);

  useEffect(() => {
    loadNotes(currentPage);
  }, [currentPage]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "notes":
        return FileText;
      case "summary":
        return BookOpen;
      case "mcq":
        return CheckCircle;
      case "practice":
        return HelpCircle;
      default:
        return FileText;
    }
  };

  // Filter notes for client-side filtering (starred, recent)
  const getFilteredItems = () => {
    // Combine notes and study materials
    let allItems = [...notes];
    
    // Add study materials with proper formatting
    const formattedStudyMaterials = studyMaterials.map(material => ({
      ...material,
      // Map study material fields to note-like fields for consistent display
      lastAccessed: material.stats?.lastAccessed || material.updatedAt,
      starred: material.isStarred,
      pages: material.metadata?.questionCount || 1,
      views: material.stats?.views || 0,
      accuracy: material.stats?.averageScore || null,
      generatedItems: {
        mcqs: material.type === 'mcq' ? material.metadata?.questionCount : 0,
        questions: material.type === 'practice' ? material.metadata?.questionCount : 0,
      },
      status: material.status === 'active' ? 'completed' : 'processing',
      isStudyMaterial: true, // Flag to distinguish from regular notes
    }));
    
    allItems = [...allItems, ...formattedStudyMaterials];

    // Apply subject filter
    if (selectedSubject) {
      allItems = allItems.filter((item) => item.subject === selectedSubject);
    }

    // Apply folder filter
    if (selectedFolder) {
      const [folderName, subjectName] = selectedFolder.split('-');
      allItems = allItems.filter((item) => item.folder === folderName && item.subject === subjectName);
    }

    // Apply type filters
    if (selectedFilter === "starred") {
      return allItems.filter((item) => item.starred);
    }
    if (selectedFilter === "recent") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return allItems.filter((item) => new Date(item.lastAccessed) > threeDaysAgo);
    }
    if (selectedFilter === "mcq") {
      return allItems.filter((item) => item.type === "mcq");
    }
    if (selectedFilter === "summary") {
      return allItems.filter((item) => item.type === "summary");
    }
    if (selectedFilter === "practice") {
      return allItems.filter((item) => item.type === "practice");
    }
    if (selectedFilter === "notes") {
      return allItems.filter((item) => item.type === "notes" || !item.isStudyMaterial);
    }
    
    return allItems;
  };

  const filteredItems = getFilteredItems();

  // Handle item click (open in new tab by default)
  const handleItemClick = (item) => {
    if (item.isStudyMaterial) {
      handleOpenStudyMaterial(item);
    } else {
      handleOpenNewTab(item);
    }
  };

  const handleItemRightClick = (e, item) => {
    e.preventDefault();
    setContextMenu({
      item,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleOpenStudyMaterial = (item) => {
    // Update stats (increment view count)
    studyToolsService.getStudyMaterialById(item._id);
    
    // Navigate to StudyTools page with specific study material
    navigate('/study-tools', {
      state: {
        activeTab: item.type,
        studyMaterialId: item._id
      }
    });
  };

  const handleOpenNewTab = (item) => {
    notesService.updateLastAccessed(item._id);
    const fileUrl = notesService.getFileUrl(item);
    const dataKey = `notes_data_${Date.now()}`;
    const dataToStore = {
      noteData: {
        ...item,
        pdfUrl: fileUrl,
      },
      isFromLibrary: true,
    };
    sessionStorage.setItem(dataKey, JSON.stringify(dataToStore));
    window.open(`/notes?key=${dataKey}`, "_blank");
  };

  const handleOpenSameTab = (item) => {
    notesService.updateLastAccessed(item._id);
    const fileUrl = notesService.getFileUrl(item);
    navigate("/notes", {
      state: {
        noteData: {
          ...item,
          pdfUrl: fileUrl,
        },
        isFromLibrary: true,
      },
    });
  };

  // Toggle star status
  const handleToggleStar = async (item) => {
    try {
      if (item.isStudyMaterial) {
        // Handle study material star toggle
        await studyToolsService.toggleStar(item._id);
        setStudyMaterials((prev) =>
          prev.map((material) =>
            material._id === item._id 
              ? { ...material, isStarred: !material.isStarred } 
              : material
          )
        );
        toast.success(item.starred ? "Removed from starred" : "Added to starred");
      } else {
        // Handle regular note star toggle
        await notesService.toggleStar(item._id, !item.starred);
        setNotes((prev) =>
          prev.map((note) =>
            note._id === item._id ? { ...note, starred: !note.starred } : note
          )
        );
        toast.success(item.starred ? "Removed from starred" : "Added to starred");
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Failed to update star status");
    }
  };

  // Delete note or study material
  const handleDeleteNote = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }
    try {
      if (item.isStudyMaterial) {
        // Delete study material
        await studyToolsService.deleteStudyMaterial(item._id);
        setStudyMaterials((prev) => prev.filter((material) => material._id !== item._id));
        toast.success("Study material deleted successfully");
      } else {
        // Delete regular note
        await notesService.deleteNote(item._id);
        setNotes((prev) => prev.filter((note) => note._id !== item._id));
        toast.success("Note deleted successfully");
        loadSubjects();
        loadFolders();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  // Generate MCQs for a note
  const handleGenerateMCQ = async (item) => {
    setGeneratingContent({ noteId: item._id, type: 'mcq' });
    try {
      toast.info("Generating MCQs... This may take a moment.");
      
      // Create and save study material in database
      const response = await studyToolsService.generateMCQ(item._id, {
        count: 10,
        difficulty: 'medium'
      });
      
      if (response.success && response.data.studyMaterial) {
        const studyMaterial = response.data.studyMaterial;
        
        // Add to study materials list
        setStudyMaterials(prev => [studyMaterial, ...prev]);
        
        // Navigate to StudyTools page with the study material
        navigate('/study-tools', { 
          state: { 
            activeTab: 'mcq',
            studyMaterialId: studyMaterial._id
          }
        });
        
        toast.success(`Generated ${studyMaterial.metadata.questionCount} MCQs for ${item.title}`);
        
        // Reload subjects and folders to update counts
        loadSubjects();
        loadFolders();
      } else {
        toast.error("Failed to generate MCQs. Please try again.");
      }
    } catch (error) {
      console.error("Error generating MCQs:", error);
      toast.error("Failed to generate MCQs. Please try again later.");
    } finally {
      setGeneratingContent(null);
    }
  };

  // Generate Summary for a note
  const handleGenerateSummary = async (item) => {
    setGeneratingContent({ noteId: item._id, type: 'summary' });
    try {
      toast.info("Generating summary... This may take a moment.");
      
      // Create and save study material in database
      const response = await studyToolsService.generateSummary(item._id, {
        length: 'medium',
        format: 'structured'
      });
      
      if (response.success && response.data.studyMaterial) {
        const studyMaterial = response.data.studyMaterial;
        
        // Add to study materials list
        setStudyMaterials(prev => [studyMaterial, ...prev]);
        
        // Navigate to StudyTools page with the study material
        navigate('/study-tools', { 
          state: { 
            activeTab: 'summaries',
            studyMaterialId: studyMaterial._id
          }
        });
        
        toast.success(`Generated summary for ${item.title}`);
        
        // Reload subjects and folders to update counts
        loadSubjects();
        loadFolders();
      } else {
        toast.error("Failed to generate summary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary. Please try again later.");
    } finally {
      setGeneratingContent(null);
    }
  };

  // Handle subject and folder clicks
  const handleSubjectClick = (subjectName) => {
    if (selectedSubject === subjectName) {
      // If already selected, clear the filter
      setSelectedSubject("");
    } else {
      setSelectedSubject(subjectName);
      setSelectedFolder(""); // Clear folder filter when selecting subject
      setSelectedFilter("all"); // Reset other filters
    }
  };

  const handleFolderClick = (folderName, subjectName) => {
    const folderKey = `${folderName}-${subjectName}`;
    if (selectedFolder === folderKey) {
      // If already selected, clear the filter
      setSelectedFolder("");
    } else {
      setSelectedFolder(folderKey);
      setSelectedSubject(""); // Clear subject filter when selecting folder
      setSelectedFilter("all"); // Reset other filters
    }
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Calculate filter counts
  const getFilterCounts = () => {
    const allItems = [...notes, ...studyMaterials];
    
    return {
      all: pagination.totalNotes + studyMaterials.length,
      starred: allItems.filter((item) => item.starred || item.isStarred).length,
      recent: allItems.filter((item) => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const lastAccessed = item.lastAccessed || item.stats?.lastAccessed || item.updatedAt;
        return new Date(lastAccessed) > threeDaysAgo;
      }).length,
      notes: notes.filter((note) => note.type === "notes" || !note.type).length,
      summary: [...notes.filter((note) => note.type === "summary"), ...studyMaterials.filter((material) => material.type === "summary")].length,
      mcq: [...notes.filter((note) => note.type === "mcq"), ...studyMaterials.filter((material) => material.type === "mcq")].length,
      practice: [...notes.filter((note) => note.type === "practice"), ...studyMaterials.filter((material) => material.type === "practice")].length,
    };
  };

  const filterCounts = getFilterCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Study Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Loading your study materials...
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <div className="w-20 h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"
                    ></div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <LoadingSkeleton viewMode={viewMode} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Study Library
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Organize and access all your study materials in one place
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button onClick={() => navigate("/upload")}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    placeholder="Search notes, summaries, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Filters */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => setSelectedFilter("all")}
                >
                  <span>All Items</span>
                  <Badge variant="secondary" className="text-xs">
                    {filterCounts.all}
                  </Badge>
                </Button>
                {Object.entries({
                  recent: filterCounts.recent,
                  notes: filterCounts.notes,
                  summary: filterCounts.summary,
                  mcq: filterCounts.mcq,
                  practice: filterCounts.practice,
                }).map(([key, count]) => (
                  <Button
                    key={key}
                    variant={selectedFilter === key ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setSelectedFilter(key)}
                  >
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {subjects.map((subject, index) => (
                  <div
                    key={subject._id}
                    className={`flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ${
                      selectedSubject === subject._id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                        : ''
                    }`}
                    onClick={() => handleSubjectClick(subject._id)}
                  >
                    <div
                      className={`w-4 h-4 rounded`}
                      style={{ backgroundColor: getSubjectColor(subject._id) }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        selectedSubject === subject._id 
                          ? 'text-blue-900 dark:text-blue-100' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {subject._id}
                      </p>
                    </div>
                    <Badge variant={selectedSubject === subject._id ? "default" : "secondary"} className="text-xs">
                      {subject.count}
                    </Badge>
                  </div>
                ))}
                {subjects.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No subjects yet. Upload some notes to get started!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Folders */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  Folders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {folders.map((folder, index) => {
                  const folderKey = `${folder._id.folder}-${folder._id.subject}`;
                  return (
                    <div
                      key={folderKey}
                      className={`flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors ${
                        selectedFolder === folderKey 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                          : ''
                      }`}
                      onClick={() => handleFolderClick(folder._id.folder, folder._id.subject)}
                    >
                      <Folder className={`w-4 h-4 ${
                        selectedFolder === folderKey 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          selectedFolder === folderKey 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {folder._id.folder}
                        </p>
                        <p className={`text-xs ${
                          selectedFolder === folderKey 
                            ? 'text-blue-700 dark:text-blue-300' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {folder._id.subject}
                        </p>
                      </div>
                      <Badge variant={selectedFolder === folderKey ? "default" : "secondary"} className="text-xs">
                        {folder.count}
                      </Badge>
                    </div>
                  );
                })}
                {folders.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No folders yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notes.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(item.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredItems.length} of {pagination.totalNotes + studyMaterials.length} items
                </p>
                {/* Active Filters Display */}
                {(selectedSubject || selectedFolder || selectedFilter !== "all") && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Filters:</span>
                    {selectedSubject && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setSelectedSubject("")}
                      >
                        Subject: {selectedSubject} ×
                      </Badge>
                    )}
                    {selectedFolder && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setSelectedFolder("")}
                      >
                        Folder: {selectedFolder.split('-')[0]} ×
                      </Badge>
                    )}
                    {selectedFilter !== "all" && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setSelectedFilter("all")}
                      >
                        Type: {selectedFilter} ×
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => {
                        setSelectedSubject("");
                        setSelectedFolder("");
                        setSelectedFilter("all");
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Items Grid/List */}
            {filteredItems.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);

                    return (
                      <Card
                        key={item._id}
                        className={`hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750 ${
                          viewMode === "list" ? "flex items-center p-4" : ""
                        }`}
                        onClick={() => handleItemClick(item)}
                        onContextMenu={(e) => handleItemRightClick(e, item)}
                      >
                        {viewMode === "grid" ? (
                          <>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-2">
                                  <TypeIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStar(item);
                                    }}
                                    className="p-1"
                                  >
                                    <Star className={`w-4 h-4 ${
                                      item.starred 
                                        ? 'text-yellow-500 fill-current' 
                                        : 'text-gray-400'
                                    }`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleItemRightClick(e, item);
                                    }}
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {item.title}
                              </h3>
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge variant="secondary" className="text-xs">
                                  {item.subject}
                                </Badge>
                                
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center space-x-1">
                                    <FileText className="w-3 h-3" />
                                    <span>{item.pages} pages</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{item.views} views</span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    Updated{" "}
                                    {new Date(
                                      item.lastAccessed
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              {item.status === "completed" && item.accuracy && (
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                  <span className="text-green-600 dark:text-green-400">
                                    {item.accuracy}% accuracy
                                  </span>
                                  <span>
                                    {item.generatedItems?.mcqs || 0} MCQs •{" "}
                                    {item.generatedItems?.questions || 0} Q&A
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                <TypeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                    {item.title}
                                  </h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStar(item);
                                    }}
                                    className="p-1"
                                  >
                                    <Star className={`w-4 h-4 ${
                                      item.starred 
                                        ? 'text-yellow-500 fill-current' 
                                        : 'text-gray-400'
                                    }`} />
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {item.subject}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                  <Badge
                                    variant={
                                      item.status === "completed"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {item.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span>{item.pages} pages</span>
                                  <span>{item.views} views</span>
                                  <span>
                                    Updated{" "}
                                    {new Date(
                                      item.lastAccessed
                                    ).toLocaleDateString()}
                                  </span>
                                  {item.status === "completed" &&
                                    item.accuracy && (
                                      <span className="text-green-600 dark:text-green-400">
                                        {item.accuracy}% accuracy
                                      </span>
                                    )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemRightClick(e, item);
                                }}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrev}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNext}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchQuery || selectedFilter !== "all"
                    ? "No items found"
                    : "No notes yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery || selectedFilter !== "all"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Start uploading your study materials to build your library."}
                </p>
                {!searchQuery && selectedFilter === "all" && (
                  <Button onClick={() => navigate("/upload")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Your First Note
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          item={contextMenu.item}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenNewTab={handleOpenNewTab}
          onOpenSameTab={handleOpenSameTab}
          onToggleStar={handleToggleStar}
          onDelete={handleDeleteNote}
          onGenerateMCQ={handleGenerateMCQ}
          onGenerateSummary={handleGenerateSummary}
          generatingContent={generatingContent}
        />
      )}
    </div>
  );
};

// Helper function to generate consistent colors for subjects
function getSubjectColor(subject) {
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export default Library;
