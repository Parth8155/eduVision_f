import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, RefreshCw } from 'lucide-react';
import notesService from '@/services/notesService';

const RecentUploads = () => {
  const navigate = useNavigate();
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    try {
      setLoading(true);
      const response = await notesService.getUserNotes({
        page: 1,
        limit: 5, // Show last 5 uploads
        sortBy: 'uploadDate',
        sortOrder: 'desc'
      });
      setRecentUploads(response.data.notes);
    } catch (error) {
      console.error('Error loading recent uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecentUploads();
    setRefreshing(false);
  };

  const handleItemClick = (note) => {
    navigate('/notes', {
      state: {
        noteData: note,
        isFromRecentUploads: true
      }
    });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;

    return uploadDate.toLocaleDateString();
  };
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Uploads</CardTitle>
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Uploads</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentUploads.length > 0 ? (
          <>
            {recentUploads.map((item) => (
              <div
                key={item._id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {getTimeAgo(item.uploadDate)}
                    </p>
                  </div>
                  {item.status === 'processing' && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">60%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/library')}
            >
              View All Uploads
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              No uploads yet
            </p>
            <Button
              size="sm"
              onClick={() => navigate('/upload')}
              className="w-full"
            >
              Upload Your First Note
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUploads;
