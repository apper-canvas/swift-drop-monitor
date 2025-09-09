export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileType = (file) => {
  const type = file.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("text")) return "text";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "archive";
  return "file";
};

export const validateFile = (file, maxSize = 100 * 1024 * 1024, allowedTypes = []) => {
  const errors = [];
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push("File type not supported");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Create thumbnail dimensions
        const maxSize = 64;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const createUploadFile = async (file, id) => {
  const thumbnail = await generateThumbnail(file);
  
  return {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "pending", // pending, uploading, completed, error
    progress: 0,
    uploadedAt: null,
    error: null,
    thumbnail,
    file: file // Store the actual file object for uploading
  };
};

export const simulateUpload = (uploadFile, onProgress) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const increment = Math.random() * 15 + 5; // Random increment between 5-20%
    
    const timer = setInterval(() => {
      progress += increment;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        
        // Simulate occasional upload failures for demo
        if (Math.random() < 0.1) {
          reject(new Error("Upload failed due to network error"));
        } else {
          resolve();
        }
      }
      
      onProgress(progress);
    }, 200 + Math.random() * 300); // Random delay between 200-500ms
  });
};