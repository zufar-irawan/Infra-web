"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Video, Music, Archive, Trash2, CheckCircle, AlertCircle, Send, Clock } from 'lucide-react';

interface FileWithPreview {
    id: string;
    file: File;
    preview?: string;
    type: 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';
    size: string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    progress?: number;
    error?: string;
}

interface TugasUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    tugasId: string;
    tugasTitle: string;
    deadline: string;
    onUploadComplete?: (files: FileWithPreview[]) => void;
}

export default function TugasUploadModal({
    isOpen,
    onClose,
    tugasId,
    tugasTitle,
    deadline,
    onUploadComplete
}: TugasUploadModalProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [comment, setComment] = useState('');
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
        // Check file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            return { valid: false, error: 'File terlalu besar. Maksimal 50MB' };
        }

        // Check file type
        const acceptedTypes = [
            'image/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'video/*',
            'audio/*',
            'application/zip',
            'application/x-rar-compressed'
        ];

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

            if (files.length + validFiles.length >= 10) {
                errors.push('Maksimal 10 file');
                break;
            }

            const fileType = getFileType(file);
            const preview = await createFilePreview(file);
            
            validFiles.push({
                id: `${Date.now()}-${Math.random()}`,
                file,
                preview,
                type: fileType,
                size: formatFileSize(file.size),
                status: 'pending'
            });
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        }
    }, [files]);

    const removeFile = (fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const simulateUpload = async (fileItem: FileWithPreview) => {
        return new Promise<void>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    resolve();
                }
                
                setFiles(prev => prev.map(f => 
                    f.id === fileItem.id 
                        ? { ...f, progress, status: progress === 100 ? 'completed' : 'uploading' }
                        : f
                ));
            }, 200);
        });
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            alert('Pilih file terlebih dahulu');
            return;
        }

        setIsUploading(true);
        
        try {
            // Simulate upload for each file
            for (const fileItem of files) {
                await simulateUpload(fileItem);
            }
            
            // Call completion callback
            onUploadComplete?.(files);
            
            // Reset form
            setFiles([]);
            setComment('');
            
            // Close modal
            onClose();
            
        } catch (error) {
            console.error('Upload error:', error);
            alert('Terjadi kesalahan saat upload');
        } finally {
            setIsUploading(false);
        }
    };

    const formatDeadline = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Upload Tugas</h2>
                            <p className="text-orange-100 text-sm mt-1">{tugasTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 text-orange-100 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {formatDeadline(deadline)}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Upload Area */}
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                            isDragOver
                                ? 'border-orange-400 bg-orange-50 scale-[1.02]'
                                : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50/30'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleUploadClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,video/*,audio/*,application/zip,application/x-rar-compressed"
                            onChange={handleFileInput}
                            className="hidden"
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
                                    {isDragOver ? 'Lepaskan file di sini' : 'Upload File Tugas'}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    Drag & drop file atau klik untuk memilih
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Maksimal 10 file, 50MB per file
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
                                    
                                    return (
                                        <div
                                            key={fileItem.id}
                                            className={`bg-white border rounded-xl p-4 transition-all duration-200 ${
                                                fileItem.status === 'completed' 
                                                    ? 'border-green-200 bg-green-50' 
                                                    : fileItem.status === 'error'
                                                    ? 'border-red-200 bg-red-50'
                                                    : 'border-gray-200 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* File Icon */}
                                                <div className="flex-shrink-0">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                        fileItem.status === 'completed' 
                                                            ? 'bg-green-100' 
                                                            : fileItem.status === 'error'
                                                            ? 'bg-red-100'
                                                            : 'bg-gray-100'
                                                    }`}>
                                                        <IconComponent className={`w-5 h-5 ${
                                                            fileItem.status === 'completed' 
                                                                ? 'text-green-600' 
                                                                : fileItem.status === 'error'
                                                                ? 'text-red-600'
                                                                : 'text-gray-600'
                                                        }`} />
                                                    </div>
                                                </div>

                                                {/* File Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-gray-800 truncate">
                                                            {fileItem.file.name}
                                                        </p>
                                                        {fileItem.status === 'completed' && (
                                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        )}
                                                        {fileItem.status === 'error' && (
                                                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {fileItem.size} • {fileItem.type}
                                                    </p>
                                                    
                                                    {/* Progress Bar */}
                                                    {fileItem.status === 'uploading' && fileItem.progress !== undefined && (
                                                        <div className="mt-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                                                                    style={{ width: `${fileItem.progress}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">{fileItem.progress}%</p>
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
                                                    disabled={fileItem.status === 'uploading'}
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

                    {/* Comment Section */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Komentar (Opsional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tambahkan komentar untuk tugas Anda..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        disabled={isUploading}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={files.length === 0 || isUploading}
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Kirim Tugas
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
