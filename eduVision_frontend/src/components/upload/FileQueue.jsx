import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react';
// import { type UploadedFile } from '@/types/upload';

const FileQueue = ({ files, onRemoveFile, onRetryFile }) => {
  const completedFiles = files.filter(f => f.status === 'completed');
  const processingFiles = files.filter(f => f.status === 'processing' || f.status === 'uploading');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing with OCR...';
      case 'completed':
        return 'Ready';
      case 'error':
        return 'Failed';
      default:
        return '';
    }
  };

  if (files.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Upload Queue ({files.length})</CardTitle>
          <CardDescription>
            {completedFiles.length} completed • {processingFiles.length} processing
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry All
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* File Preview */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm text-gray-600">
                        {getStatusText(file.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    {file.confidence && (
                      <span className="text-green-600">
                        OCR Confidence: {file.confidence}%
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="mb-2">
                      <Progress value={file.progress} className="h-1.5" />
                      <div className="text-xs text-gray-500 mt-1">
                        {file.status === 'uploading' ? 'Uploading...' : 'Processing with AI...'}
                        {file.progress}%
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    {file.status === 'error' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetryFile(file.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    )}
                    {file.status === 'completed' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(file.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileQueue;
