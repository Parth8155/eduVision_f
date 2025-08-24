import { useState } from "react";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload as UploadIcon, Camera } from "lucide-react";
import Navigation from "@/components/Navigation";
import UploadZone from "@/components/upload/UploadZone";
import ProcessingWorkflow from "@/components/upload/ProcessingWorkflow";
import FileQueue from "@/components/upload/FileQueue";
import CameraCapture from "@/components/upload/CameraCapture";
import OrganizationSidebar from "@/components/upload/OrganizationSidebar";
import uploadService from "@/services/uploadServise";
import RecentUploads from "../components/upload/RecentUploads";

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );
      addFiles(newFiles);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );
      addFiles(newFiles);
    }
  };

  const addFiles = (newFiles) => {
    const uploadFiles = newFiles.map((file, index) => ({
      ...file,
      id: `${Date.now()}-${index}`,
      progress: 0,
      status: "pending",
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
      originalFile: file,
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const retryFile = (fileId) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, status: "pending", progress: 0, error: undefined }
          : f
      )
    );
  };

  const uploadAllFiles = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    let finalTitle = noteTitle.trim();
    let finalSubject = selectedSubject.trim();
    if (!finalTitle) {
      const firstFile = files[0];
      if (firstFile && firstFile.name) {
        finalTitle = firstFile.name.replace(/\.[^/.]+$/, "");
      } else if (
        firstFile &&
        firstFile.originalFile &&
        firstFile.originalFile.name
      ) {
        finalTitle = firstFile.originalFile.name.replace(/\.[^/.]+$/, "");
      } else {
        finalTitle = "Untitled Note";
      }
    }
    if (!finalSubject) {
      finalSubject = "General Notes";
    }
    setUploading(true);
    try {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "uploading",
          progress: 0,
        }))
      );
      const filesToUpload = files.map((f) => {
        if ("originalFile" in f && f.originalFile instanceof File) {
          return f.originalFile;
        }
        return new File([f], f.name, { type: f.type });
      });
      if (
        filesToUpload.length === 0 ||
        !filesToUpload.every((f) => f instanceof File)
      ) {
        throw new Error("Invalid file objects for upload");
      }
      const response = await uploadService.uploadFiles(filesToUpload, {
        title: finalTitle,
        subject: finalSubject,
        folder: selectedFolder || "General",
      });
      if (response.success) {
        toast.success(`Note "${finalTitle}" created successfully!`);
        setFiles((prev) =>
          prev.map((f) => ({
            ...f,
            status: "completed",
            progress: 100,
          }))
        );
        setTimeout(() => {
          setNoteTitle("");
          setSelectedSubject("");
          setSelectedFolder("");
          setFiles([]);
        }, 2000);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        }))
      );
    } finally {
      setUploading(false);
    }
  };

  const completedFiles = files.filter((f) => f.status === "completed");
  const processingFiles = files.filter(
    (f) => f.status === "processing" || f.status === "uploading"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Dashboard</span> <span className="mx-2">›</span>{" "}
            <span className="text-gray-900 dark:text-white">Upload Notes</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Your Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your handwritten notes into AI-powered study materials
            with advanced OCR and content generation
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Upload Area - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Processing Workflow Indicator */}
            {(processingFiles.length > 0 || completedFiles.length > 0) && (
              <ProcessingWorkflow files={files} />
            )}

            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
                <TabsTrigger
                  value="upload"
                  className="flex items-center dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Files
                </TabsTrigger>
                <TabsTrigger
                  value="camera"
                  className="flex items-center dark:data-[state=active]:bg-gray-700 dark:text-gray-300 dark:data-[state=active]:text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera Capture
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <UploadZone
                  dragActive={dragActive}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onFileSelect={handleFileSelect}
                />

                <FileQueue
                  files={files}
                  onRemoveFile={removeFile}
                  onRetryFile={retryFile}
                />

                {/* Upload button with proper event handling */}
                {files.length > 0 && (
                  <div className="flex justify-end space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      {files.length} file{files.length === 1 ? "" : "s"}{" "}
                      selected
                    </div>
                    <button
                      type="button"
                      onClick={uploadAllFiles}
                      disabled={uploading}
                      className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center transition-colors"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        `Upload ${files.length} file${
                          files.length === 1 ? "" : "s"
                        }`
                      )}
                    </button>
                  </div>
                )}

                {/* Show helpful message when title/subject are empty */}
                {files.length > 0 &&
                  (!noteTitle.trim() || !selectedSubject.trim()) && (
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-400 dark:text-blue-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Auto-generation enabled
                          </h3>
                          <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                            {!noteTitle.trim() && (
                              <p>• Title will be generated from filename</p>
                            )}
                            {!selectedSubject.trim() && (
                              <p>• Subject will be set to "General Notes"</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <RecentUploads />
              </TabsContent>

              <TabsContent value="camera">
                <CameraCapture />
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div>
            <OrganizationSidebar
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
