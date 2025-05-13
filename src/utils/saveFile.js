import path from 'path';
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from 'fs';

export const saveFile = async (fileInput) => {
  if (!fileInput) return [];

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  mkdirSync(uploadDir, { recursive: true });

  // Handle both single file and array of files
  const files = Array.isArray(fileInput) ? fileInput : [fileInput];
  const uploadedUrls = [];

  // Validate file type and size for each file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes

  for (const file of files) {
    if (!file) continue;

    // Generate a unique filename using a timestamp
    const timestamp = Date.now();
    const baseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const ext = path.extname(file.name).toLowerCase();
    const uniqueName = `${timestamp}_${baseName}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type for ${file.name}: Only images (JPEG, JPG, PNG, GIF, WebP) are allowed`);
    }

    // Validate file size
    if (file.size > maxSize) {
      throw new Error(`File size for ${file.name} exceeds 5MB limit`);
    }

    // Read the file as a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write the file to disk
    writeFileSync(filePath, buffer);

    uploadedUrls.push(`/uploads/${uniqueName}`);
  }

  return uploadedUrls; // Return array of URLs
};

export const deleteFile = (filePath) => {
  if (!filePath) return;

  // Handle both single file path and array of file paths
  const filePaths = Array.isArray(filePath) ? filePath : [filePath];

  for (const filePathItem of filePaths) { // Changed 'path' to 'filePathItem' to avoid shadowing
    if (!filePathItem || filePathItem === '') continue;
    const fullPath = path.join(process.cwd(), 'public', filePathItem); // Use imported path module
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
    }
  }
};