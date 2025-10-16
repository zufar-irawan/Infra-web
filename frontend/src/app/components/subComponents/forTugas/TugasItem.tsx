"use client";

import React, { useState } from 'react';
import { Upload, CheckCircle, Clock, User, Calendar } from 'lucide-react';
import TugasUploadModal from './TugasUploadModal';

interface TugasItemProps {
    tugas: any;
    isCompleted?: boolean;
}

export default function TugasItem({ tugas, isCompleted = false }: TugasItemProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

    const isOverdue = () => {
        const now = new Date();
        const deadline = new Date(tugas.deadline);
        return now > deadline;
    };

    const handleUploadComplete = (files: any[]) => {
        console.log('Upload completed:', files);
        // TODO: Implementasi API call untuk submit tugas
        setIsUploadModalOpen(false);
    };

    return (
        <>
            <div className="flex items-start sm:items-center justify-between py-4 gap-2">
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">{tugas.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{tugas.teacher?.user?.name || 'Guru'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Deadline: {formatDeadline(tugas.deadline)}</span>
                            </div>
                        </div>
                        {tugas.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {tugas.description}
                            </p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted 
                                ? 'bg-green-100 text-green-700' 
                                : isOverdue()
                                ? 'bg-red-100 text-red-700'
                                : 'bg-orange-100 text-orange-700'
                        }`}>
                            {isCompleted ? (
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Selesai
                                </div>
                            ) : isOverdue() ? (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Terlambat
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    {isCompleted ? (
                        <button className="text-sm bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-600 hover:shadow transition-all duration-200">
                            <CheckCircle className="w-4 h-4" />
                            Sudah Dikumpulkan
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow transition-all duration-200 ${
                                isOverdue()
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                        >
                            <Upload className="w-4 h-4" />
                            {isOverdue() ? 'Upload (Terlambat)' : 'Upload Tugas'}
                        </button>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <TugasUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                tugasId={tugas.id}
                tugasTitle={tugas.title}
                deadline={tugas.deadline}
                onUploadComplete={handleUploadComplete}
            />
        </>
    );
}
