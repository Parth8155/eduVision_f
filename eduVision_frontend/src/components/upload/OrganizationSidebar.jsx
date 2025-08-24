import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FolderOpen, Plus } from 'lucide-react';

const OrganizationSidebar = ({
  noteTitle,
  setNoteTitle,
  selectedSubject,
  setSelectedSubject,
  selectedFolder,
  setSelectedFolder
}) => {
  return (
    <div className="space-y-6">
      {/* File Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Organization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Note Title</label>
            <Input 
              placeholder="Auto-suggested from content..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject-select" className="text-sm font-medium text-gray-700">Subject</label>
            <select 
              id="subject-select"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Select subject...</option>
              <option value="mathematics">📐 Mathematics</option>
              <option value="physics">⚛️ Physics</option>
              <option value="chemistry">🧪 Chemistry</option>
              <option value="biology">🧬 Biology</option>
              <option value="history">📚 History</option>
              <option value="literature">📖 Literature</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="folder-select" className="text-sm font-medium text-gray-700">Folder</label>
            <select 
              id="folder-select"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              <option value="">Choose folder...</option>
              <option value="chapter1-5">📁 Chapter 1-5</option>
              <option value="exam-prep">📁 Exam Prep</option>
              <option value="lab-notes">📁 Lab Notes</option>
              <option value="assignments">📁 Assignments</option>
            </select>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create New Folder
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <Input 
              placeholder="Add tags (comma separated)"
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default OrganizationSidebar;
