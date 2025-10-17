"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: any[];
    classes: any[];
    rooms: any[];
    onSubmit: (examData: ExamFormData) => void;
    isLoading?: boolean;
}

interface ExamFormData {
    subject_id: string;
    class_id: string;
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    room_id: string;
}

export default function CreateExamModal({ isOpen, onClose, subjects, classes, rooms, onSubmit, isLoading }: CreateExamModalProps) {
    const [formData, setFormData] = useState<ExamFormData>({
        subject_id: '',
        class_id: '',
        title: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        room_id: ''
    });

    const [errors, setErrors] = useState<Partial<ExamFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name as keyof ExamFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ExamFormData> = {};

        if (!formData.subject_id) newErrors.subject_id = 'Mata pelajaran harus dipilih';
        if (!formData.class_id) newErrors.class_id = 'Kelas harus dipilih';
        if (!formData.title.trim()) newErrors.title = 'Judul ujian harus diisi';
        if (!formData.date) newErrors.date = 'Tanggal harus dipilih';
        if (!formData.start_time) newErrors.start_time = 'Waktu mulai harus diisi';
        if (!formData.end_time) newErrors.end_time = 'Waktu selesai harus diisi';
        if (!formData.room_id) newErrors.room_id = 'Ruangan harus dipilih';

        // Validate time
        if (formData.start_time && formData.end_time) {
            if (formData.start_time >= formData.end_time) {
                newErrors.end_time = 'Waktu selesai harus lebih besar dari waktu mulai';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm() && !isLoading) {
            onSubmit(formData);
            // Don't reset form here - let parent component handle it after successful submission
        }
    };

    const handleClose = () => {
        if (isLoading) return; // Prevent closing while loading

        setFormData({
            subject_id: '',
            class_id: '',
            title: '',
            description: '',
            date: '',
            start_time: '',
            end_time: '',
            room_id: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Buat Ujian Baru</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                <p className="text-sm text-gray-600">Sedang membuat ujian...</p>
                            </div>
                        </div>
                    )}

                    {/* Subject and Class Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Subject */}
                        <div>
                            <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Mata Pelajaran *
                            </label>
                            <select
                                id="subject_id"
                                name="subject_id"
                                value={formData.subject_id}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                    errors.subject_id ? 'border-red-500' : 'border-gray-300'
                                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Pilih Mata Pelajaran</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subject_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.subject_id}</p>
                            )}
                        </div>

                        {/* Class */}
                        <div>
                            <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Kelas *
                            </label>
                            <select
                                id="class_id"
                                name="class_id"
                                value={formData.class_id}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                    errors.class_id ? 'border-red-500' : 'border-gray-300'
                                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Pilih Kelas</option>
                                {classes.map((classItem) => (
                                    <option key={classItem.id} value={classItem.id}>
                                        {classItem.name}
                                    </option>
                                ))}
                            </select>
                            {errors.class_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.class_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Judul Ujian *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Masukkan judul ujian"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Masukkan deskripsi ujian (opsional)"
                            rows={3}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none ${
                                isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Tanggal *
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                    errors.date ? 'border-red-500' : 'border-gray-300'
                                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            {errors.date && (
                                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                            )}
                        </div>

                        {/* Start Time */}
                        <div>
                            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                                Waktu Mulai *
                            </label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                    errors.start_time ? 'border-red-500' : 'border-gray-300'
                                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            {errors.start_time && (
                                <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                            )}
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                                Waktu Selesai *
                            </label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                    errors.end_time ? 'border-red-500' : 'border-gray-300'
                                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            {errors.end_time && (
                                <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                            )}
                        </div>
                    </div>

                    {/* Room */}
                    <div>
                        <label htmlFor="room_id" className="block text-sm font-medium text-gray-700 mb-2">
                            Ruangan *
                        </label>
                        <select
                            id="room_id"
                            name="room_id"
                            value={formData.room_id}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                                errors.room_id ? 'border-red-500' : 'border-gray-300'
                            } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Pilih Ruangan</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.name}
                                </option>
                            ))}
                        </select>
                        {errors.room_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.room_id}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className={`px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            {isLoading ? 'Membuat Ujian...' : 'Buat Ujian'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
