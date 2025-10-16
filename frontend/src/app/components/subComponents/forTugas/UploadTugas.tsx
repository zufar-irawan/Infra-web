"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Video, Music, Archive, Trash2, CheckCircle } from 'lucide-react';

interface FileWithPreview {
    id: string;
    file: File;
    preview?: string;
    type: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';
    size: string;
}

interface UploadTugasProps {
    onFilesChange?: (files: FileWithPreview[]) => void;
    maxFiles?: number;
    maxSizePerFile?: number; // in MB
    acceptedTypes?: string[];
    disabled?: boolean;
}

export default function UploadTugas({ 
    onFilesChange, 
    maxFiles = 10, 
    maxSizePerFile = 50,
    acceptedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    disabled = false
}: UploadTugasProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return Image;
        if (type.includes('pdf') || type.includes('document')) return FileText;
        if (type.startsWith('video/')) return Video;
        if (type.startsWith('audio/')) return Music;
        if (type.includes('zip') || type.includes('rar')) return Archive;
        return File;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileType = (file: File): FileWithPreview['type'] => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type.startsWith('audio/')) return 'audio';
        if (file.type.includes('zip') || file.type.includes('rar')) return 'archive';
        if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
        return 'other';
    };

    const createFilePreview = (file: File): Promise<string | undefined> => {
        return new Promise((resolve) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            } else {
                resolve(undefined);
            }
        });
    };

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        // Check file size
        if (file.size > maxSizePerFile * 1024 * 1024) {
            return { valid: false, error: `File terlalu besar. Maksimal ${maxSizePerFile}MB` };
        }

        // Check file type
        const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
        });

        if (!isAccepted) {
            return { valid: false, error: 'Tipe file tidak didukung' };
        }

        return { valid: true };
    };

    const addFiles = useCallback(async (newFiles: FileList) => {
        const validFiles: FileWithPreview[] = [];
        const errors: string[] = [];

        for (let i = 0; i < newFiles.length; i++) {
            const file = newFiles[i];
            const validation = validateFile(file);
            
            if (!validation.valid) {
                errors.push(`${file.name}: ${validation.error}`);
                continue;
            }

            if (files.length + validFiles.length >= maxFiles) {
                errors.push(`Maksimal ${maxFiles} file`);
                break;
            }

            const fileType = getFileType(file);
            const preview = await createFilePreview(file);
            
            validFiles.push({
                id: `${Date.now()}-${Math.random()}`,
                file,
                preview,
                type: fileType,
                size: formatFileSize(file.size)
            });
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            const updatedFiles = [...files, ...validFiles];
            setFiles(updatedFiles);
            onFilesChange?.(updatedFiles);
        }
    }, [files, maxFiles, maxSizePerFile, acceptedTypes, onFilesChange]);

    const removeFile = (fileId: string) => {
        const updatedFiles = files.filter(f => f.id !== fileId);
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        if (disabled) return;
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            addFiles(droppedFiles);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            addFiles(selectedFiles);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="w-full">
            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                    isDragOver
                        ? 'border-orange-400 bg-orange-50 scale-[1.02]'
                        : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50/30'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={disabled}
                />
                
                <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full transition-colors ${
                        isDragOver ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                        <Upload className={`w-8 h-8 ${
                            isDragOver ? 'text-orange-600' : 'text-gray-600'
                        }`} />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {isDragOver ? 'Lepaskan file di sini' : 'Upload Tugas'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                            Drag & drop file atau klik untuk memilih
                        </p>
                        <p className="text-gray-500 text-xs">
                            Maksimal {maxFiles} file, {maxSizePerFile}MB per file
                        </p>
                        <p className="text-gray-500 text-xs">
                            Format: PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MP3, ZIP
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <File className="w-4 h-4" />
                        File Terpilih ({files.length})
                    </h4>
                    
                    <div className="space-y-2">
                        {files.map((fileItem) => {
                            const IconComponent = getFileIcon(fileItem.file.type);
                            const progress = uploadProgress[fileItem.id] || 0;
                            
                            return (
                                <div
                                    key={fileItem.id}
                                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* File Icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <IconComponent className="w-5 h-5 text-gray-600" />
                                            </div>
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {fileItem.file.name}
                                                </p>
                                                {progress === 100 && (
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {fileItem.size} • {fileItem.type}
                                            </p>
                                            
                                            {/* Progress Bar */}
                                            {progress > 0 && progress < 100 && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Preview Button for Images */}
                                        {fileItem.preview && (
                                            <button
                                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200 transition-colors"
                                                onClick={() => window.open(fileItem.preview, '_blank')}
                                            >
                                                Preview
                                            </button>
                                        )}

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFile(fileItem.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            disabled={disabled}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
                <div className="mt-6 flex gap-3">
                    <button
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={disabled}
                    >
                        Upload Tugas
                    </button>
                    <button
                        onClick={() => setFiles([])}
                        className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        disabled={disabled}
                    >
                        Batal
                    </button>
                </div>
            )}
        </div>
    );
}
