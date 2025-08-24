import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Upload as UploadIcon, Eye, Zap, CheckCircle } from 'lucide-react';
// import type { UploadedFile } from '@/types/upload';

const ProcessingWorkflow = ({ files }) => {
  const maxStage = Math.max(...files.map(f => {
    if (f.status === 'uploading') return 0;
    if (f.status === 'processing') return 1;
    if (f.status === 'completed') return 3;
    return 0;
  }));

  const stages = [
    { stage: 'upload', label: 'Upload', icon: UploadIcon, desc: 'File transfer' },
    { stage: 'ocr', label: 'OCR Analysis', icon: Eye, desc: 'Text extraction' },
    { stage: 'ai', label: 'AI Generation', icon: Zap, desc: 'Study materials' },
    { stage: 'complete', label: 'Complete', icon: CheckCircle, desc: 'Ready to use' }
  ];

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Processing Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          {stages.map((item, index) => {
            const Icon = item.icon;
            const isActive = index <= maxStage;

            return (
              <div key={item.stage} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isActive ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                  }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                <span className="text-xs text-gray-400">{item.desc}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingWorkflow;
