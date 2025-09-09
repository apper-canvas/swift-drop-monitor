import React, { useState, useEffect } from "react";
import FileUploader from "@/components/organisms/FileUploader";
import FileQueue from "@/components/organisms/FileQueue";
import UploadStats from "@/components/molecules/UploadStats";
import Loading, { FileItemSkeleton, UploadStatsSkeleton } from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import uploadService from "@/services/api/uploadService";
import { toast } from "react-toastify";

const HomePage = () => {
  const [currentSession, setCurrentSession] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load current session on component mount
  useEffect(() => {
    loadCurrentSession();
  }, []);

  const loadCurrentSession = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const session = await uploadService.getCurrentSession();
      setCurrentSession(session);
      setFiles(session.files || []);
    } catch (err) {
      setError("Failed to load upload session");
      console.error("Session loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesAdd = async (newFiles) => {
    try {
      if (!currentSession) return;

      const updatedSession = await uploadService.addFilesToSession(
        currentSession.Id, 
        newFiles
      );
      
      setCurrentSession(updatedSession);
      setFiles(updatedSession.files);
    } catch (err) {
      toast.error("Failed to add files to session");
      console.error("Add files error:", err);
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      if (!currentSession) return;

      const updatedSession = await uploadService.removeFileFromSession(
        currentSession.Id,
        fileId
      );
      
      setCurrentSession(updatedSession);
      setFiles(updatedSession.files);
      toast.success("File removed from queue");
    } catch (err) {
      toast.error("Failed to remove file");
      console.error("Remove file error:", err);
    }
  };

  const handleStartUpload = async () => {
    try {
      if (!currentSession) return;

      setUploading(true);
      const pendingFiles = files.filter(f => f.status === "pending");
      
      if (pendingFiles.length === 0) {
        toast.info("No files to upload");
        return;
      }

      // Upload files sequentially to better demonstrate progress
      for (const file of pendingFiles) {
        try {
          await uploadService.uploadFile(
            currentSession.Id,
            file.id,
            (fileId, progress) => {
              // Update file progress in real-time
              setFiles(currentFiles => 
                currentFiles.map(f => 
                  f.id === fileId 
                    ? { ...f, progress, status: "uploading" }
                    : f
                )
              );
            }
          );

          // Update file status to completed
          setFiles(currentFiles => 
            currentFiles.map(f => 
              f.id === file.id 
                ? { ...f, status: "completed", progress: 100, uploadedAt: new Date().toISOString() }
                : f
            )
          );
        } catch (uploadError) {
          // Update file status to error
          setFiles(currentFiles => 
            currentFiles.map(f => 
              f.id === file.id 
                ? { ...f, status: "error", progress: 0, error: uploadError.message }
                : f
            )
          );
          
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Reload session to get updated state
      await loadCurrentSession();
      
      const completedCount = files.filter(f => f.status === "completed").length;
      const errorCount = files.filter(f => f.status === "error").length;
      
      if (errorCount === 0) {
        toast.success(`All ${completedCount} files uploaded successfully!`);
      } else {
        toast.warning(`${completedCount} files uploaded, ${errorCount} failed`);
      }
      
    } catch (err) {
      toast.error("Upload session failed");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleClearCompleted = async () => {
    try {
      if (!currentSession) return;

      const updatedSession = await uploadService.clearCompletedFiles(currentSession.Id);
      setCurrentSession(updatedSession);
      setFiles(updatedSession.files);
      toast.success("Completed files cleared");
    } catch (err) {
      toast.error("Failed to clear completed files");
      console.error("Clear completed error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <Loading message="Loading upload session..." />
          
          <div className="grid gap-8">
            <UploadStatsSkeleton />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <FileItemSkeleton />
              <FileItemSkeleton />
              <FileItemSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Error
          title="Failed to Load Session"
          message={error}
          onRetry={loadCurrentSession}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Upload Stats */}
        <UploadStats files={files} />

        {/* File Uploader */}
        <FileUploader onFilesAdd={handleFilesAdd} />

        {/* File Queue */}
        <FileQueue
          files={files}
          onRemoveFile={handleRemoveFile}
          onStartUpload={handleStartUpload}
          onClearCompleted={handleClearCompleted}
        />
      </div>
    </div>
  );
};

export default HomePage;