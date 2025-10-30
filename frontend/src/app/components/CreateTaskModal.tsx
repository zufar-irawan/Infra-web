"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Upload, X, File, Image, FileText, Video, Music, Archive, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useEduData } from "@/app/edu/context";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    teacher: any;
    subjects: any;
    classes: any;
    rooms: any;
}

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

export default function CreateTaskModal({ isOpen, onClose, onSuccess, teacher, subjects, classes, rooms }: CreateTaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        subject_id: '',
        class_id: '',
        title: '',
        description: '',
        deadline: '',
        links: ''
    });

    // File handling functions
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
        if (file.size > 50 * 1024 * 1024) {
            return { valid: false, error: 'File terlalu besar. Maksimal 50MB' };
        }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.class_id || !formData.title || !formData.deadline) {
            alert('Semua field wajib harus diisi!');
            return;
        }

        setLoading(true);
        try {
            setFiles(prev => prev.map(f => ({ ...f, status: 'uploading', progress: undefined })));

            const payload = new FormData();
            payload.append('created_by', String(teacher.user_id));
            payload.append('class_id', formData.class_id);
            if (formData.subject_id) payload.append('subject_id', formData.subject_id);
            payload.append('title', formData.title);
            if (formData.description) payload.append('description', formData.description);
            if (formData.deadline) payload.append('deadline', formData.deadline);
            if (formData.links) payload.append('links[]', formData.links);
            files.forEach(fileItem => {
                payload.append('files[]', fileItem.file);
            });

            await axios.post('/api/tugas', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setFiles(prev => prev.map(f => ({ ...f, status: 'completed', progress: 100 })));

            alert('Tugas berhasil dibuat!');
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
            setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: 'Gagal mengunggah file' })));
            alert('Gagal membuat tugas. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            subject_id: '',
            class_id: '',
            title: '',
            description: '',
            deadline: '',
            links: ''
        });
        setFiles([]);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">Buat Tugas Baru</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Subject Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mata Pelajaran <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.subject_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, subject_id: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="">Pilih Mata Pelajaran</option>
                                { // @ts-ignore
                                    subjects.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Class Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Kelas <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.class_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, class_id: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="">Pilih Kelas</option>
                                { // @ts-ignore
                                    classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Judul Tugas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Masukkan judul tugas..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Deskripsi <span className="text-gray-400 text-xs">(Opsional)</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Masukkan deskripsi tugas..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tenggat Waktu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.deadline}
                            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            File Lampiran <span className="text-gray-400 text-xs">(Opsional)</span>
                        </label>
                        <div className="space-y-3">
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${isDragOver
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

                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-3 rounded-full transition-colors ${isDragOver ? 'bg-orange-100' : 'bg-gray-100'
                                        }`}>
                                        <Upload className={`w-6 h-6 ${isDragOver ? 'text-orange-600' : 'text-gray-600'
                                            }`} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            {isDragOver ? 'Lepaskan file di sini' : 'Klik atau drag & drop file'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Maksimal 10 file, 50MB per file
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Uploaded Files List */}
                            {files.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <File className="w-4 h-4" />
                                        File Terpilih ({files.length})
                                    </h4>

                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {files.map((fileItem) => {
                                            const IconComponent = getFileIcon(fileItem.file.type);

                                            return (
                                                <div
                                                    key={fileItem.id}
                                                    className={`bg-white border rounded-lg p-3 transition-all duration-200 ${fileItem.status === 'completed'
                                                        ? 'border-green-200 bg-green-50'
                                                        : fileItem.status === 'error'
                                                            ? 'border-red-200 bg-red-50'
                                                            : 'border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${fileItem.status === 'completed'
                                                                ? 'bg-green-100'
                                                                : fileItem.status === 'error'
                                                                    ? 'bg-red-100'
                                                                    : 'bg-gray-100'
                                                                }`}>
                                                                <IconComponent className={`w-4 h-4 ${fileItem.status === 'completed'
                                                                    ? 'text-green-600'
                                                                    : fileItem.status === 'error'
                                                                        ? 'text-red-600'
                                                                        : 'text-gray-600'
                                                                    }`} />
                                                            </div>
                                                        </div>

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
                                                                {fileItem.size}
                                                            </p>

                                                            {fileItem.status === 'uploading' && fileItem.progress !== undefined && (
                                                                <div className="mt-1">
                                                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                                                        <div
                                                                            className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                                                                            style={{ width: `${fileItem.progress}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(fileItem.id)}
                                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
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
                        </div>
                    </div>

                    {/* Reference Links */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Link Referensi <span className="text-gray-400 text-xs">(Opsional)</span>
                        </label>
                        <input
                            type="url"
                            value={formData.links}
                            onChange={(e) => setFormData(prev => ({ ...prev, links: e.target.value }))}
                            placeholder="https://example.com/referensi-belajar"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Membuat...' : 'Buat Tugas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
