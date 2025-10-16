"use client";

import { useEduData } from "@/app/edu/context";
import UploadTugas from "@/app/components/subComponents/forTugas/UploadTugas";
import TugasUploadModal from "@/app/components/subComponents/forTugas/TugasUploadModal";
import { useState } from "react";
import { Upload, FileText, Clock, CheckCircle } from "lucide-react";

export default function TugasSiswa() {
    const { user } = useEduData();
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (user?.role !== 'siswa') return null;

    const handleFilesChange = (files: any[]) => {
        setUploadedFiles(files);
        console.log('Files selected:', files);
    };

    const handleUpload = () => {
        // Implementasi upload logic di sini
        console.log('Uploading files:', uploadedFiles);
        // TODO: Implementasi API call untuk upload
    };

    const handleModalUploadComplete = (files: any[]) => {
        console.log('Modal upload completed:', files);
        setIsModalOpen(false);
    };

    return (
        <div className="w-full p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Tugas</h1>
                    <p className="text-gray-600">Upload file tugas Anda dengan mudah menggunakan drag & drop</p>
                </div>

                {/* Quick Upload Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                                <Upload className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Upload Cepat</h3>
                                <p className="text-sm text-gray-600">Upload file dengan modal popup</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Buka Upload Modal
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Upload Inline</h3>
                                <p className="text-sm text-gray-600">Upload langsung di halaman ini</p>
                            </div>
                        </div>
                        <button
                            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Scroll ke Upload Area
                        </button>
                    </div>
                </div>

                {/* Upload Section */}
                <div id="upload-section" className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Upload File Tugas</h2>
                        <p className="text-gray-600 text-sm">Pilih file yang ingin Anda upload untuk tugas ini</p>
                    </div>
                    
                    <UploadTugas 
                        onFilesChange={handleFilesChange}
                        maxFiles={5}
                        maxSizePerFile={25}
                    />
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">Petunjuk Upload:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Drag & drop file ke area upload atau klik untuk memilih file</li>
                        <li>• Format yang didukung: PDF, DOC, DOCX, TXT, JPG, PNG, MP4, MP3, ZIP</li>
                        <li>• Maksimal 5 file dengan ukuran maksimal 25MB per file</li>
                        <li>• Pastikan file yang diupload sesuai dengan instruksi tugas</li>
                    </ul>
                </div>

                {/* Features */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-800">Drag & Drop</h4>
                        </div>
                        <p className="text-sm text-green-700">Seret file langsung ke area upload untuk kemudahan</p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-purple-800">Progress Tracking</h4>
                        </div>
                        <p className="text-sm text-purple-700">Pantau progress upload file secara real-time</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-5 h-5 text-orange-600" />
                            <h4 className="font-semibold text-orange-800">File Preview</h4>
                        </div>
                        <p className="text-sm text-orange-700">Preview file sebelum upload untuk memastikan kebenaran</p>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <TugasUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tugasId="example-tugas-id"
                tugasTitle="Contoh Tugas Upload"
                deadline={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
                onUploadComplete={handleModalUploadComplete}
            />
        </div>
    );
}