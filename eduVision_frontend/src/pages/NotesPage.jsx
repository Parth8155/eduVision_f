import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/notes/Sidebar";
import ContentArea from "../components/notes/ContentArea";
import NotesPanel from "../components/notes/NotesPanel";
import notesService from "@/services/notesService";

const MainLayout = React.memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteData, setNoteData] = useState(null);
  const [isFromLibrary, setIsFromLibrary] = useState(false);
  const [isFromDashboard, setIsFromDashboard] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notesPanelCollapsed, setNotesPanelCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Notes");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedText, setSelectedText] = useState(null);

  // Get data from URL parameters or location state
  const getLibraryData = () => {
    const dataParam = searchParams.get("data");
    const keyParam = searchParams.get("key");
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(dataParam));
        return decoded;
      } catch (error) {
        console.error("Error parsing URL data:", error);
      }
    }
    if (keyParam) {
      try {
        const storedData = sessionStorage.getItem(keyParam);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          return parsed;
        } else {
          console.warn("No data found in sessionStorage for key:", keyParam);
          console.log(
            "Available sessionStorage keys:",
            Object.keys(sessionStorage)
          );
        }
      } catch (error) {
        console.error("Error parsing session data:", error);
      }
    }
    return {
      noteData: location.state?.noteData,
      isFromLibrary: location.state?.isFromLibrary,
      isFromDashboard: location.state?.isFromDashboard,
    };
  };

  useEffect(() => {
    const libraryState = getLibraryData();
    const extractedNoteData = libraryState?.noteData;
    const extractedIsFromLibrary = libraryState?.isFromLibrary;
    const extractedIsFromDashboard = libraryState?.isFromDashboard;
    if (extractedNoteData) {
      setNoteData(extractedNoteData);
      setIsFromLibrary(extractedIsFromLibrary || false);
      setIsFromDashboard(extractedIsFromDashboard || false);
      setIsLoading(false);
      const keyParam = searchParams.get("key");
      if (keyParam) {
        setTimeout(() => {
          sessionStorage.removeItem(keyParam);
        }, 1000);
      }
    } else {
      setError("No note data available");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = notesService.getAuthToken();
    if (!token) {
      toast.error("Please login to access notes");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const pdfUrl = useMemo(() => {
    if (!noteData) return null;
    if (noteData?.pdfUrl) return noteData.pdfUrl;
    if (noteData?._id) return notesService.getFileUrl(noteData);
    return null;
  }, [noteData]);

  const handleBack = useCallback(() => {
    if (window.opener) {
      window.close();
    } else {
      if (isFromLibrary) {
        navigate("/library");
      } else if (isFromDashboard) {
        navigate("/dashboard");
      } else {
        navigate("/library");
      }
    }
  }, [isFromLibrary, isFromDashboard, navigate]);

  const handleDownloadPDF = useCallback(async () => {
    if (!pdfUrl) {
      toast.error("No PDF URL available for download");
      return;
    }
    try {
      const token = notesService.getAuthToken();
      const response = await fetch(pdfUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${noteData.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  }, [pdfUrl, noteData?.title]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: noteData.title,
          text: `Check out this note: ${noteData.title}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy link");
        });
    }
  }, [noteData?.title]);

  const handleTextSelection = useCallback(
    (selection) => {
      setSelectedText(selection);
      if (activeTab !== "AI Chat") {
        setActiveTab("AI Chat");
      }
    },
    [activeTab]
  );

  const clearSelectedText = useCallback(() => {
    setSelectedText(null);
  }, []);

  const handlePdfLoadSuccess = useCallback(
    (numPages) => {
      setTotalPages(numPages);
      if (noteData?._id) {
        notesService.updateLastAccessed(noteData._id).catch(console.error);
      }
    },
    [noteData?._id]
  );

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleNotesPanelToggle = useCallback(() => {
    setNotesPanelCollapsed((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handlePdfLoadError = useCallback(
    (error) => {
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        setError("Authentication required. Please login again.");
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(error.message);
        toast.error(`Failed to load PDF: ${error.message}`);
      }
    },
    [navigate]
  );

  const handleExportAnnotations = useCallback(() => {
    // TODO: Implement PDF export with annotations
    console.log('Export annotations functionality to be implemented');
    toast.info('Export functionality coming soon!');
  }, []);

  const handleSaveAnnotations = useCallback(() => {
  }, []);

  const handleCreateNumberAnnotation = useCallback(
    (number, position) => {
      const annotationNote = {
        text: `Annotation ${number}`,
        pageNumber: position.pageNumber,
        context: `Number annotation marker at position (${position.x}, ${position.y})`,
      };
      setSelectedText(annotationNote);
      if (activeTab !== "Notes") {
        setActiveTab("Notes");
      }
      toast.success(
        `Number annotation ${number} created on page ${position.pageNumber}`
      );
    },
    [activeTab]
  );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            Loading...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Preparing your note viewer
          </p>
        </div>
      </div>
    );
  }

  if (error || !noteData) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">
            📄
          </div>
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            {error || "No Note Data Available"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The note data could not be loaded. This might happen if:
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-300 text-left mb-4 space-y-1">
            <li>• The page was refreshed or opened directly</li>
            <li>• The session data expired</li>
            <li>• The note was accessed through an invalid link</li>
          </ul>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/library")}
              className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-4 py-2 rounded"
            >
              Go to Library
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        noteData={noteData}
        onBack={handleBack}
        onDownload={handleDownloadPDF}
        onShare={handleShare}
      />
      <div className="flex-1 flex min-w-0 overflow-hidden">
        <ContentArea
          noteData={noteData}
          pdfUrl={pdfUrl}
          onLoadSuccess={handlePdfLoadSuccess}
          onLoadError={handlePdfLoadError}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onTextSelection={handleTextSelection}
          onCreateNumberAnnotation={handleCreateNumberAnnotation}
          noteId={noteData?._id || noteData?.id}
          onSave={handleSaveAnnotations}
          onExport={handleExportAnnotations}
        />
        <NotesPanel
          activeTab={activeTab}
          onTabChange={handleTabChange}
          noteData={noteData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          selectedText={selectedText}
          onClearSelectedText={clearSelectedText}
          isCollapsed={notesPanelCollapsed}
          onToggleCollapse={handleNotesPanelToggle}
        />
      </div>
    </div>
  );
});

MainLayout.displayName = "MainLayout";

export default MainLayout;
