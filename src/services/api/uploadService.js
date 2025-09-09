import uploadSessionsData from "@/services/mockData/uploadSessions.json";
import { simulateUpload } from "@/utils/fileUtils";

class UploadService {
  constructor() {
    this.uploadSessions = [...uploadSessionsData];
    this.currentSessionId = 1;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllSessions() {
    await this.delay(300);
    return [...this.uploadSessions];
  }

  async getSessionById(id) {
    await this.delay(200);
    const session = this.uploadSessions.find(s => s.Id === parseInt(id));
    return session ? { ...session } : null;
  }

  async createSession() {
    await this.delay(250);
    
    const maxId = this.uploadSessions.length > 0 
      ? Math.max(...this.uploadSessions.map(s => s.Id))
      : 0;
    
    const newSession = {
      Id: maxId + 1,
      files: [],
      totalSize: 0,
      completedSize: 0,
      startTime: new Date().toISOString(),
      status: "pending"
    };
    
    this.uploadSessions.push(newSession);
    this.currentSessionId = newSession.Id;
    return { ...newSession };
  }

  async getCurrentSession() {
    let session = this.uploadSessions.find(s => s.Id === this.currentSessionId);
    
    if (!session) {
      session = await this.createSession();
    }
    
    return { ...session };
  }

  async addFilesToSession(sessionId, files) {
    await this.delay(200);
    
    const sessionIndex = this.uploadSessions.findIndex(s => s.Id === parseInt(sessionId));
    if (sessionIndex === -1) throw new Error("Session not found");
    
    const session = this.uploadSessions[sessionIndex];
    session.files = [...session.files, ...files];
    session.totalSize = session.files.reduce((acc, file) => acc + file.size, 0);
    
    return { ...session };
  }

  async removeFileFromSession(sessionId, fileId) {
    await this.delay(200);
    
    const sessionIndex = this.uploadSessions.findIndex(s => s.Id === parseInt(sessionId));
    if (sessionIndex === -1) throw new Error("Session not found");
    
    const session = this.uploadSessions[sessionIndex];
    session.files = session.files.filter(f => f.id !== fileId);
    session.totalSize = session.files.reduce((acc, file) => acc + file.size, 0);
    session.completedSize = session.files
      .filter(f => f.status === "completed")
      .reduce((acc, file) => acc + file.size, 0);
    
    return { ...session };
  }

  async uploadFile(sessionId, fileId, onProgress) {
    const sessionIndex = this.uploadSessions.findIndex(s => s.Id === parseInt(sessionId));
    if (sessionIndex === -1) throw new Error("Session not found");
    
    const session = this.uploadSessions[sessionIndex];
    const fileIndex = session.files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) throw new Error("File not found");
    
    const file = session.files[fileIndex];
    
    // Update file status to uploading
    file.status = "uploading";
    file.progress = 0;
    file.error = null;
    
    try {
      // Simulate upload with progress updates
      await simulateUpload(file, (progress) => {
        file.progress = Math.min(progress, 100);
        if (onProgress) onProgress(fileId, progress);
      });
      
      // Mark as completed
      file.status = "completed";
      file.progress = 100;
      file.uploadedAt = new Date().toISOString();
      
      // Update session completed size
      session.completedSize = session.files
        .filter(f => f.status === "completed")
        .reduce((acc, file) => acc + file.size, 0);
      
      // Update session status
      const allCompleted = session.files.every(f => f.status === "completed");
      const hasErrors = session.files.some(f => f.status === "error");
      
      if (allCompleted) {
        session.status = "completed";
      } else if (hasErrors) {
        session.status = "partial";
      } else {
        session.status = "uploading";
      }
      
      return { ...file };
    } catch (error) {
      file.status = "error";
      file.error = error.message;
      file.progress = 0;
      
      // Update session status to show errors
      session.status = "partial";
      
      throw error;
    }
  }

  async clearCompletedFiles(sessionId) {
    await this.delay(200);
    
    const sessionIndex = this.uploadSessions.findIndex(s => s.Id === parseInt(sessionId));
    if (sessionIndex === -1) throw new Error("Session not found");
    
    const session = this.uploadSessions[sessionIndex];
    session.files = session.files.filter(f => f.status !== "completed");
    session.totalSize = session.files.reduce((acc, file) => acc + file.size, 0);
    session.completedSize = 0;
    
    if (session.files.length === 0) {
      session.status = "pending";
    }
    
    return { ...session };
  }

  async getUploadHistory(limit = 10) {
    await this.delay(300);
    
    const completedSessions = this.uploadSessions
      .filter(s => s.status === "completed" && s.files.length > 0)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit);
    
    return completedSessions.map(s => ({ ...s }));
  }
}

export default new UploadService();