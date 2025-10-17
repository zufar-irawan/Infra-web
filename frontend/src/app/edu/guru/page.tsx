"use client";

import DashHeader from "@/app/components/DashHeader";
import { useEduData } from "@/app/edu/context";
import api from "../../lib/api";
import Swal from "sweetalert2";
import {
	BadgeCheck,
	ClipboardSignature,
	Loader2,
	Pencil,
	Plus,
	RefreshCw,
	Search,
	Trash2,
	UserCog,
} from "lucide-react";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";

type TeacherRecord = {
	id: number;
	user_id: number;
	nip: string;
	specialization?: string | null;
	join_date: string;
	status: string;
	user?: {
		id: number;
		name: string;
		email: string;
		phone?: string | null;
		status?: string | null;
	} | null;
};

type TeacherFormState = {
	accountMode: "existing" | "new";
	user_id: string;
	user_name: string;
	user_email: string;
	user_password: string;
	user_phone: string;
	user_status: string;
	nip: string;
	specialization: string;
	join_date: string;
	status: string;
};

const STATUS_OPTIONS = [
	{ value: "aktif", label: "Aktif" },
	{ value: "nonaktif", label: "Nonaktif" },
];

const ACCOUNT_MODE_OPTIONS = [
	{ value: "new" as const, label: "Buat akun baru" },
	{ value: "existing" as const, label: "Gunakan akun yang ada" },
];

const initialFormState: TeacherFormState = {
	accountMode: "new",
	user_id: "",
	user_name: "",
	user_email: "",
	user_password: "",
	user_phone: "",
	user_status: "aktif",
	nip: "",
	specialization: "",
	join_date: "",
	status: "aktif",
};

const getToken = () => {
	if (typeof window === "undefined") return null;
	return sessionStorage.getItem("token");
};

export default function GuruPage() {
	const { user, teacher, student } = useEduData();

	const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [search, setSearch] = useState<string>("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [formState, setFormState] = useState<TeacherFormState>(initialFormState);
	const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);
	const [submitting, setSubmitting] = useState<boolean>(false);

	const canManage = user?.role === "admin";

	const fetchTeachers = useCallback(async () => {
		const token = getToken();
		if (!token) {
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const res = await api.get("/lms/teachers", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const payload = res.data;
			const list = Array.isArray(payload) ? payload : payload?.data ?? [];
			setTeachers(list);
		} catch (error: any) {
			console.error("Gagal mengambil data guru", error);
			Swal.fire({
				icon: "error",
				title: "Gagal",
				text:
					error?.response?.data?.message ??
					"Tidak dapat mengambil data guru.",
			});
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTeachers();
	}, [fetchTeachers]);

	const filteredTeachers = useMemo(() => {
		let data = [...teachers];

		if (statusFilter !== "all") {
			data = data.filter((t) => (t.status ?? "aktif") === statusFilter);
		}

		if (search.trim()) {
			const query = search.toLowerCase();
			data = data.filter((t) => {
				const name = t.user?.name ?? "";
				const email = t.user?.email ?? "";
				const nip = t.nip ?? "";
				const spec = t.specialization ?? "";
				return (
					name.toLowerCase().includes(query) ||
					email.toLowerCase().includes(query) ||
					nip.toLowerCase().includes(query) ||
					spec.toLowerCase().includes(query)
				);
			});
		}

		return data;
	}, [teachers, statusFilter, search]);

	const stats = useMemo(() => {
		const total = teachers.length;
		const aktif = teachers.filter((t) => (t.status ?? "aktif") === "aktif").length;
		const nonaktif = teachers.filter((t) => (t.status ?? "aktif") !== "aktif").length;
		return { total, aktif, nonaktif };
	}, [teachers]);

	const resetFilters = () => {
		setSearch("");
		setStatusFilter("all");
		fetchTeachers();
	};

	const openCreateModal = () => {
		setModalMode("create");
		setSelectedTeacher(null);
		setFormState({
			...initialFormState,
			accountMode: "new",
			join_date: new Date().toISOString().slice(0, 10),
		});
		setIsModalOpen(true);
	};

	const openEditModal = (teacherRecord: TeacherRecord) => {
		setModalMode("edit");
		setSelectedTeacher(teacherRecord);
		setFormState({
			accountMode: "existing",
			user_id: String(teacherRecord.user_id ?? ""),
			user_name: teacherRecord.user?.name ?? "",
			user_email: teacherRecord.user?.email ?? "",
			user_password: "",
			user_phone: teacherRecord.user?.phone ?? "",
			user_status: teacherRecord.user?.status ?? "aktif",
			nip: teacherRecord.nip ?? "",
			specialization: teacherRecord.specialization ?? "",
			join_date: teacherRecord.join_date
				? teacherRecord.join_date.slice(0, 10)
				: "",
			status: teacherRecord.status ?? "aktif",
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedTeacher(null);
		setFormState(initialFormState);
	};

	const handleFormChange = (field: keyof TeacherFormState, value: string) => {
		setFormState((prev) => {
			if (field === "accountMode") {
				return {
					...prev,
					accountMode: value as TeacherFormState["accountMode"],
					user_id: "",
					user_name: "",
					user_email: "",
					user_password: "",
					user_phone: "",
					user_status: "aktif",
				};
			}

			return { ...prev, [field]: value };
		});
	};

	const buildPayload = () => {
		const payload: Record<string, any> = {
			nip: formState.nip,
			specialization: formState.specialization || null,
			join_date: formState.join_date || null,
			status: formState.status,
		};

		if (modalMode === "create") {
			if (formState.accountMode === "existing") {
				payload.user_id = formState.user_id ? Number(formState.user_id) : null;
			} else {
				payload.user_name = formState.user_name;
				payload.user_email = formState.user_email;
				payload.user_password = formState.user_password;
				if (formState.user_phone) {
					payload.user_phone = formState.user_phone;
				}
				if (formState.user_status) {
					payload.user_status = formState.user_status;
				}
			}
		}

		return payload;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const token = getToken();
		if (!token) {
			Swal.fire({ icon: "warning", title: "Tidak ada token" });
			return;
		}

		if (!formState.nip || !formState.join_date) {
			Swal.fire({
				icon: "warning",
				title: "Form belum lengkap",
				text: "NIP dan tanggal bergabung wajib diisi.",
			});
			return;
		}

		if (modalMode === "create") {
			if (formState.accountMode === "existing") {
				if (!formState.user_id) {
					Swal.fire({
						icon: "warning",
						title: "User belum dipilih",
						text: "Isi User ID atau pilih opsi buat akun baru.",
					});
					return;
				}
			} else {
				if (!formState.user_name || !formState.user_email || !formState.user_password) {
					Swal.fire({
						icon: "warning",
						title: "Data akun belum lengkap",
						text: "Nama, email, dan password wajib diisi untuk membuat akun baru.",
					});
					return;
				}
			}
		}

		const payload = buildPayload();

		setSubmitting(true);
		try {
			if (modalMode === "create") {
				await api.post("/lms/teachers", payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire({
					icon: "success",
					title: "Berhasil",
					text: "Data guru berhasil ditambahkan.",
				});
			} else if (selectedTeacher) {
				await api.put(`/lms/teachers/${selectedTeacher.id}`, payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire({
					icon: "success",
					title: "Berhasil",
					text: "Data guru berhasil diperbarui.",
				});
			}
			closeModal();
			fetchTeachers();
		} catch (error: any) {
			console.error("Gagal menyimpan guru", error);
			Swal.fire({
				icon: "error",
				title: "Gagal",
				text:
					error?.response?.data?.message ??
					"Terjadi kesalahan saat menyimpan data guru.",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (teacherRecord: TeacherRecord) => {
		if (!canManage) return;
		const confirm = await Swal.fire({
			icon: "warning",
			title: "Hapus guru?",
			text: `Data guru ${teacherRecord.user?.name ?? ""} akan dihapus permanen.`,
			showCancelButton: true,
			confirmButtonText: "Hapus",
			cancelButtonText: "Batal",
		});
		if (!confirm.isConfirmed) return;

		const token = getToken();
		if (!token) return;

		try {
			await api.delete(`/lms/teachers/${teacherRecord.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			Swal.fire({ icon: "success", title: "Berhasil", text: "Data guru dihapus." });
			fetchTeachers();
		} catch (error: any) {
			console.error("Gagal menghapus guru", error);
			Swal.fire({
				icon: "error",
				title: "Gagal",
				text:
					error?.response?.data?.message ??
					"Tidak dapat menghapus data guru.",
			});
		}
	};

	const renderModal = () => {
		if (!isModalOpen) return null;

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
				<div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
					<div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
						<div>
							<h2 className="text-lg font-semibold text-gray-800">
								{modalMode === "create" ? "Tambah Guru" : "Edit Data Guru"}
							</h2>
							<p className="text-sm text-gray-500">
								{modalMode === "create"
									? "Lengkapi form untuk menambahkan guru baru ke LMS."
									: "Perbarui informasi guru sesuai kebutuhan."}
							</p>
						</div>
						<button
							onClick={closeModal}
							className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
							aria-label="Tutup"
						>
							<span className="text-xl leading-none">×</span>
						</button>
					</div>

					<form onSubmit={handleSubmit} className="grid gap-5 px-6 py-6">
						{modalMode === "create" && (
							<div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<h3 className="text-sm font-semibold text-gray-700">Pengaturan Akun LMS</h3>
										<p className="text-xs text-gray-500">
											Pilih apakah ingin menggunakan akun yang sudah ada atau membuat akun baru sekaligus.
										</p>
									</div>
									<div className="flex gap-2">
										{ACCOUNT_MODE_OPTIONS.map((option) => {
											const isActive = formState.accountMode === option.value;
											return (
												<button
													key={option.value}
													type="button"
													onClick={() => handleFormChange("accountMode", option.value)}
													className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
														isActive
															? "border-orange-500 bg-white text-orange-600 shadow-sm"
															: "border-transparent bg-transparent text-gray-500 hover:border-orange-200 hover:text-orange-500"
													}`}
												>
													{option.label}
												</button>
											);
										})}
									</div>
								</div>

								{formState.accountMode === "existing" ? (
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="sm:col-span-1">
											<label className="mb-1 block text-sm font-medium text-gray-600">
												User ID (akun guru)
											</label>
											<input
												type="number"
												value={formState.user_id}
												onChange={(e) => handleFormChange("user_id", e.target.value)}
												className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
												placeholder="Masukkan ID user yang sudah ada"
												required={formState.accountMode === "existing"}
											/>
											<p className="mt-1 text-xs text-gray-400">
												Pastikan user memiliki peran guru sebelum ditautkan.
											</p>
										</div>
									</div>
								) : (
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<label className="mb-1 block text-sm font-medium text-gray-600">
												Nama Lengkap
											</label>
											<input
												type="text"
												value={formState.user_name}
												onChange={(e) => handleFormChange("user_name", e.target.value)}
												className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
												placeholder="Nama sesuai akun"
												required={formState.accountMode === "new"}
											/>
										</div>
										<div>
											<label className="mb-1 block text-sm font-medium text-gray-600">
												Email
											</label>
											<input
												type="email"
												value={formState.user_email}
												onChange={(e) => handleFormChange("user_email", e.target.value)}
												className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
												placeholder="contoh@email.com"
												required={formState.accountMode === "new"}
											/>
										</div>
										<div>
											<label className="mb-1 block text-sm font-medium text-gray-600">
												Password Awal
											</label>
											<input
												type="password"
												value={formState.user_password}
												onChange={(e) => handleFormChange("user_password", e.target.value)}
												className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
												placeholder="Minimal 6 karakter"
												required={formState.accountMode === "new"}
											/>
										</div>
										<div>
											<label className="mb-1 block text-sm font-medium text-gray-600">
												Nomor Telepon (opsional)
											</label>
											<input
												type="text"
												value={formState.user_phone}
												onChange={(e) => handleFormChange("user_phone", e.target.value)}
												className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
												placeholder="08xxxxxxxxxx"
											/>
										</div>
										<div>
											<label className="mb-1 block text-sm font-medium text-gray-600">
												Status Akun
											</label>
											<select
												value={formState.user_status}
												onChange={(e) => handleFormChange("user_status", e.target.value)}
												className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
											>
												{STATUS_OPTIONS.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</div>
									</div>
								)}
							</div>
						)}

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-600">
									NIP
								</label>
								<input
									type="text"
									value={formState.nip}
									onChange={(e) => handleFormChange("nip", e.target.value)}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
									placeholder="Masukkan NIP"
									required
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-600">
									Keahlian / Bidang
								</label>
								<input
									type="text"
									value={formState.specialization}
									onChange={(e) => handleFormChange("specialization", e.target.value)}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
									placeholder="Contoh: Multimedia"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-600">
									Tanggal Bergabung
								</label>
								<input
									type="date"
									value={formState.join_date}
									onChange={(e) => handleFormChange("join_date", e.target.value)}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
									required
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-600">
									Status Guru
								</label>
								<select
									value={formState.status}
									onChange={(e) => handleFormChange("status", e.target.value)}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
								>
									{STATUS_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
							<button
								type="button"
								onClick={closeModal}
								className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={submitting}
								className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 disabled:opacity-70"
							>
								{submitting && <Loader2 className="h-4 w-4 animate-spin" />}
								{modalMode === "create" ? "Simpan" : "Perbarui"}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen overflow-y-auto bg-gray-50">
			<DashHeader user={user} student={student} teacher={teacher} />

			<section className="space-y-6 px-4 pb-8">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
						<div className="flex items-center gap-3">
							<UserCog className="h-10 w-10 rounded-full bg-orange-100 p-2 text-orange-500" />
							<div>
								<p className="text-xs font-medium uppercase text-gray-500">Total Guru</p>
								<p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
							</div>
						</div>
					</div>
					<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
						<div className="flex items-center gap-3">
							<BadgeCheck className="h-10 w-10 rounded-full bg-emerald-100 p-2 text-emerald-600" />
							<div>
								<p className="text-xs font-medium uppercase text-gray-500">Aktif</p>
								<p className="text-3xl font-semibold text-emerald-600">{stats.aktif}</p>
							</div>
						</div>
					</div>
					<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
						<div className="flex items-center gap-3">
							<ClipboardSignature className="h-10 w-10 rounded-full bg-gray-100 p-2 text-gray-500" />
							<div>
								<p className="text-xs font-medium uppercase text-gray-500">Nonaktif</p>
								<p className="text-3xl font-semibold text-gray-600">{stats.nonaktif}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
							<div className="relative">
								<label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
									Cari
								</label>
								<div className="relative">
									<input
										type="text"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Nama, email, NIP, keahlian"
										className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
									/>
									<Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
								</div>
							</div>
							<div>
								<label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
									Status
								</label>
								<select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
								>
									<option value="all">Semua</option>
									{STATUS_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-center gap-3 self-end">
								<button
									onClick={resetFilters}
									className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
								>
									<RefreshCw className="h-4 w-4" /> Reset
								</button>
							</div>
						</div>

						{canManage && (
							<button
								onClick={openCreateModal}
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
							>
								<Plus className="h-4 w-4" /> Tambah Guru
							</button>
						)}
					</div>
				</div>

				<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-100 text-sm">
							<thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
								<tr>
									<th className="px-6 py-3 text-left">Nama</th>
									<th className="px-6 py-3 text-left">NIP</th>
									<th className="px-6 py-3 text-left">Email</th>
									<th className="px-6 py-3 text-left">Keahlian</th>
									<th className="px-6 py-3 text-left">Tanggal Bergabung</th>
									<th className="px-6 py-3 text-left">Status</th>
									{canManage && <th className="px-6 py-3 text-right">Aksi</th>}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{loading ? (
									<tr>
										<td colSpan={canManage ? 7 : 6} className="px-6 py-10 text-center text-sm text-gray-500">
											<div className="flex items-center justify-center gap-2">
												<Loader2 className="h-5 w-5 animate-spin text-orange-500" />
												Memuat data guru...
											</div>
										</td>
									</tr>
								) : filteredTeachers.length === 0 ? (
									<tr>
										<td colSpan={canManage ? 7 : 6} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
											Tidak ada data guru yang cocok dengan filter.
										</td>
									</tr>
								) : (
									filteredTeachers.map((t) => {
										const joinDate = t.join_date
											? new Date(t.join_date).toLocaleDateString("id-ID", {
													day: "2-digit",
													month: "long",
													year: "numeric",
												})
											: "-";
										const statusBadge = STATUS_OPTIONS.find((opt) => opt.value === (t.status ?? "aktif"))?.label ?? t.status;
										return (
											<tr key={t.id} className="hover:bg-orange-50/50">
												<td className="px-6 py-4 text-sm font-medium text-gray-800">
													{t.user?.name ?? "-"}
												</td>
												<td className="px-6 py-4 text-sm text-gray-600">{t.nip ?? "-"}</td>
												<td className="px-6 py-4 text-sm text-gray-600">{t.user?.email ?? "-"}</td>
												<td className="px-6 py-4 text-sm text-gray-600">{t.specialization ?? "-"}</td>
												<td className="px-6 py-4 text-sm text-gray-600">{joinDate}</td>
												<td className="px-6 py-4">
													<span
														className={`rounded-full px-3 py-1 text-xs font-semibold ${
															(t.status ?? "aktif") === "aktif"
																? "bg-emerald-100 text-emerald-700"
																: "bg-gray-100 text-gray-600"
														}`}
													>
														{statusBadge}
													</span>
												</td>
												{canManage && (
													<td className="px-6 py-4 text-right text-sm">
														<div className="flex items-center justify-end gap-2">
															<button
																onClick={() => openEditModal(t)}
																className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
															>
																<Pencil className="h-3.5 w-3.5" /> Edit
															</button>
															<button
																onClick={() => handleDelete(t)}
																className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
															>
																<Trash2 className="h-3.5 w-3.5" /> Hapus
															</button>
														</div>
													</td>
												)}
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{renderModal()}
		</div>
	);
}
