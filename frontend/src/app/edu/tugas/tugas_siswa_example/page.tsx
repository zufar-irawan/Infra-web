"use client";

import { useEduData } from "@/app/edu/context";
import UploadTugas from "@/app/components/subComponents/forTugas/UploadTugas";
import TugasUploadModal from "@/app/components/subComponents/forTugas/TugasUploadModal";
import React, { useState, useEffect, useMemo } from 'react';
import { Upload, FileText, Clock, CheckCircle } from "lucide-react";
import DashHeader from "@/app/components/DashHeader";
import { Plus, Pencil, Trash2, Calendar, Save, X } from "lucide-react";
import axios from "axios";

interface GuruTugasItem {
	id: string;
	title: string;
	description?: string;
	deadline: string; // ISO string
	classId?: string | number;
}

export default function TugasSiswa() {
    const { user, student, tugas, teachers } = useEduData();

    const classId = useMemo(() => student?.class?.id ?? student?.class_id ?? student?.classId ?? null, [student])

    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilesChange = (files: any[]) => {
        setUploadedFiles(files);
        console.log('Files selected:', files);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("assignment_id", "1");
        formData.append("student_id", String(student?.id || 1));
        formData.append("grade", "0");
        formData.append("feedback", "");
        formData.append("submitted_at", new Date().toISOString());

        uploadedFiles.forEach((file) => {
            formData.append("files[]", file);
        });

        try {
            const res = await axios.post("/api/tugas/submit", formData, {
                // Let axios set the multipart boundary automatically
                onUploadProgress: (progressEvent) => {
                    // @ts-ignore
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log("Progress:", percent, "%");
                },
            });

            console.log("Upload sukses:", res.data);
        } catch (err) {
            console.error("Upload gagal:", err);
        }
    };

    const handleModalUploadComplete = (files: any[]) => {
        console.log('Modal upload completed:', files);
        setIsModalOpen(false);
    };


	const [tasks, setTasks] = useState<GuruTugasItem[]>([
		{
			id: "t1",
			title: "Latihan Aljabar",
			description: "Selesaikan soal nomor 1-10 pada lembar kerja.",
			deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
		},
		{
			id: "t2",
			title: "Tugas Trigonometri",
			description: "Buat ringkasan identitas trigonometri dasar.",
			deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
		},
	]);

	const [editingTask, setEditingTask] = useState<GuruTugasItem | null>(null);
	const [form, setForm] = useState<Pick<GuruTugasItem, "title" | "description" | "deadline">>({
		title: "",
		description: "",
		deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
	});

	const openCreate = () => {
		setEditingTask(null);
		setForm({
			title: "",
			description: "",
			deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		});
		setIsModalOpen(true);
	};

	const openEdit = (task: GuruTugasItem) => {
		setEditingTask(task);
		setForm({ title: task.title, description: task.description ?? "", deadline: task.deadline });
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingTask(null);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		if (!form.title.trim()) return;
		if (editingTask) {
			setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...form } : t));
		} else {
			setTasks(prev => [
				{ id: `t-${Date.now()}`, title: form.title.trim(), description: form.description, deadline: form.deadline, classId: classId ?? undefined },
				...prev,
			]);
		}
		closeModal();
	};

	const handleDelete = (id: string) => {
		setTasks(prev => prev.filter(t => t.id !== id));
	};

	const formatDeadline = (iso: string) => {
		const d = new Date(iso);
		return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	};


    return (
        <>
            {user?.role === 'guru' && (
				<div className="overflow-y-auto min-h-screen">
					<DashHeader user={user} student={student} />

					<div className="w-full p-4 flex flex-col gap-4">
						{/* Header + Actions */}
						<div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center justify-between">
							<div>
								<h1 className="text-xl font-semibold">Manajemen Tugas</h1>
								<p className="text-black/60 text-sm">Buat, ubah, dan kelola tugas untuk siswa</p>
							</div>
							<button
								onClick={openCreate}
								className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
							>
								<Plus className="w-4 h-4" />
								Buat Tugas
							</button>
						</div>

						{/* Tasks List */}
						<div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
							<div className="divide-y divide-black/10">
								{tasks.length === 0 && (
									<div className="text-center text-gray-400 py-8">Belum ada tugas</div>
								)}
								{tasks.map(task => (
									<div key={task.id} className="py-4 flex items-start sm:items-center justify-between gap-4">
										<div className="flex-1 min-w-0">
											<h3 className="font-medium text-gray-800">{task.title}</h3>
											<p className="text-sm text-black/60 line-clamp-2">{task.description}</p>
											<p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
												<Calendar className="w-3 h-3" /> Deadline: {formatDeadline(task.deadline)}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => openEdit(task)}
												className="text-sm bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
											>
												<Pencil className="w-4 h-4" />
												Ubah
											</button>
											<button
												onClick={() => handleDelete(task.id)}
												className="text-sm bg-red-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
											>
												<Trash2 className="w-4 h-4" />
												Hapus
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Modal */}
					{isModalOpen && (
						<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
							<div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
								<div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 flex items-center justify-between">
									<h2 className="font-semibold">
										{editingTask ? 'Ubah Tugas' : 'Buat Tugas'}
									</h2>
									<button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
										<X className="w-5 h-5" />
									</button>
								</div>

								<div className="p-5 space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Judul Tugas</label>
										<input
											name="title"
											value={form.title}
											onChange={handleChange}
											placeholder="Masukkan judul tugas"
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
										<textarea
											name="description"
											value={form.description}
											onChange={handleChange}
											placeholder="Instruksi atau detail tugas"
											rows={4}
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
											<Clock className="w-4 h-4 text-orange-600" /> Deadline
										</label>
										<input
											type="datetime-local"
											name="deadline"
											value={new Date(form.deadline).toISOString().slice(0,16)}
											onChange={(e) => {
												const v = e.target.value;
												const iso = new Date(v).toISOString();
												setForm(prev => ({ ...prev, deadline: iso }));
											}}
											className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
										/>
										<p className="text-xs text-gray-500 mt-1">Format waktu mengikuti zona waktu perangkat Anda</p>
									</div>
								</div>

								<div className="bg-gray-50 px-5 py-4 flex justify-end gap-2">
									<button onClick={closeModal} className="px-5 py-2 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
										<X className="w-4 h-4" />
										Batal
									</button>
									<button onClick={handleSave} className="px-5 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
										<Save className="w-4 h-4" />
										Simpan
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
            
            {user?.role === 'siswa' && (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader user={user} student={student} />

                    <div className="w-full p-4">
                        <div className=" mx-auto">
                            {/* Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">PENGAYAAN MATEMATIKA</h1>
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
                </div>
            )}
        </>
    );
}