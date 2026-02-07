import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * File Upload API Route
 * POST /api/upload
 * 
 * Handles file uploads (profile pictures, book covers, etc.)
 * Files are saved to the public/uploads directory
 * 
 * In production, you should:
 * - Upload to cloud storage (S3, Cloudinary, etc.)
 * - Add file validation and size limits
 * - Implement virus scanning
 * - Add authentication
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    
    // Create directory if it doesn't exist
    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error('File write error:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }
    
    // Return the public URL
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        url: fileUrl,
        filename: fileName,
        size: file.size,
        type: file.type,
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to list uploaded files (optional)
export async function GET() {
  return NextResponse.json(
    {
      message: 'Upload endpoint',
      method: 'POST',
      maxSize: '5MB',
      allowedTypes: ALLOWED_TYPES,
    },
    { status: 200 }
  );
}
