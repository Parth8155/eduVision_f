import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload as UploadIcon } from 'lucide-react';

const UploadZone = ({
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect
}) => {
  const fileInputRef = useRef(null);

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
      <CardContent className="p-8">
        <div
          className={`rounded-xl p-12 text-center transition-all duration-300 ${dragActive
            ? 'border-2 border-blue-500 bg-blue-50 scale-[1.02] hover:bg-gray-50'
            : 'border-2 border-transparent hover:bg-gray-200'
            }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className="relative">
            <UploadIcon className={`w-20 h-20 mx-auto mb-4 transition-colors ${dragActive ? 'text-blue-500' : 'text-gray-400'
              }`} />
            {dragActive && (
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {dragActive ? 'Drop your files here' : 'Drag and drop your notes here'}
          </h3>
          <p className="text-gray-600 mb-6">
            Support for JPG, PNG, PDF, and HEIC files up to 10MB each
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <span className="text-gray-500 text-sm">or drag and drop</span>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Batch upload supported • Auto-quality enhancement • Secure processing
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={onFileSelect}
            className="hidden"
            aria-label="Upload files"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadZone;
