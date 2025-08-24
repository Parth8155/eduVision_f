import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  BookOpen,
  Search,
  Star,
  Clock,
  FileText,
  CheckCircle,
  Plus,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import notesService from "@/services/notesService";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

const Dashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [recentNotes, setRecentNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalNotes: 0,
    studySessions: 0,
    mcqsGenerated: 0,
  });

  useEffect(() => {
    const token = notesService.getAuthToken();
    if (!token) {
      toast.error("Please login to access the dashboard");
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user info:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
      }
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadRecentNotes(), loadDashboardStats()]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentNotes = async () => {
    try {
      const response = await notesService.getUserNotes({
        page: 1,
        limit: 4,
        sortBy: "uploadDate",
        sortOrder: "desc",
      });
      setRecentNotes(response.data.notes);
    } catch (error) {
      console.error("Error loading recent notes:", error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const notesResponse = await notesService.getUserNotes({
        page: 1,
        limit: 100,
      });
      const notes = notesResponse.data.notes;
      const totalNotes = notesResponse.data.pagination.totalNotes;
      const mcqsGenerated = notes.reduce((total, note) => {
        return (
          total +
          (note.generatedItems && note.generatedItems.mcqs
            ? note.generatedItems.mcqs
            : 0)
        );
      }, 0);
      const studySessions = notes.reduce((total, note) => {
        return total + note.views;
      }, 0);
      setDashboardStats({
        totalNotes,
        studySessions,
        mcqsGenerated,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  const handleNoteClick = (note) => {
    notesService.updateLastAccessed(note._id);
    const fileUrl = notesService.getFileUrl(note);
    navigate("/notes", {
      state: {
        noteData: {
          ...note,
          pdfUrl: fileUrl,
        },
        isFromDashboard: true,
      },
    });
  };

  const getGreeting = () => {
    try {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    } catch (error) {
      console.warn("Error getting greeting:", error);
      return "Hello";
    }
  };

  const studyStats = [
    {
      label: "Notes Processed",
      value: dashboardStats.totalNotes.toString(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Study Sessions",
      value: dashboardStats.studySessions.toString(),
      icon: Clock,
      color: "text-green-600",
    },
    {
      label: "MCQs Generated",
      value: dashboardStats.mcqsGenerated.toString(),
      icon: CheckCircle,
      color: "text-purple-600",
    },

  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-96 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Loading skeletons for stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      <div className="w-12 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading skeleton for main content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-64 h-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                        <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div
                          key={j}
                          className="w-full h-10 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <ErrorBoundary fallback={null} silent={true}>
        <Navigation />
      </ErrorBoundary>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {getGreeting()}, {userInfo?.firstName || "there"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's your study progress and recent activity
              </p>
            </div>
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
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {studyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Notes */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      Recent Notes
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Your latest uploaded and processed notes
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
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
              </CardHeader>
              <CardContent>
                {recentNotes.length > 0 ? (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid md:grid-cols-2 gap-4"
                        : "space-y-4"
                    }
                  >
                    {recentNotes.map((note) => (
                      <div
                        key={note._id}
                        className={`border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                          viewMode === "list"
                            ? "flex items-center space-x-4"
                            : ""
                        }`}
                        onClick={() => handleNoteClick(note)}
                      >
                        {viewMode === "grid" && (
                          <div className="aspect-video bg-gray-100 dark:bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                              {note.title}
                            </h3>
                            <div className="flex items-center space-x-1">
                              {note.starred && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {note.subject}
                            </Badge>
                            
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {note.pages} pages •{" "}
                            {(() => {
                              try {
                                return new Date(note.uploadDate).toLocaleDateString();
                              } catch (error) {
                                console.warn("Error formatting date:", error);
                                return "Date unavailable";
                              }
                            })()}
                          </div>

                        
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No notes yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start uploading your study materials to see them here
                    </p>
                    <Link to="/upload">
                      <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Your First Note
                      </Button>
                    </Link>
                  </div>
                )}

                {recentNotes.length > 0 && (
                  <div className="mt-6 text-center">
                    <Link to="/library">
                      <Button
                        variant="outline"
                        className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        View All Notes
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/upload">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Notes
                  </Button>
                </Link>
                <Link to="/study-tools">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Study Session
                  </Button>
                </Link>
                <Link to="/library">
                  <Button variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Library
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
