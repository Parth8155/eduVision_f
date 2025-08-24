import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

const CameraCapture = () => {
  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-12 text-center">
        <Camera className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Camera Capture
        </h3>
        <p className="text-gray-600 mb-6">
          Take high-quality photos of your handwritten notes directly from your device
        </p>
        <div className="space-y-3">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            Open Camera
          </Button>
          <div className="text-sm text-gray-500">
            • Ensure good lighting • Keep text horizontal • Avoid shadows
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
