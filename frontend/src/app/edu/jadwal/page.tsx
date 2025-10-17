"use client";

import {MapPin, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit3, Trash2} from "lucide-react";
import DashHeader from "@/app/components/DashHeader"
import React, {useEffect, useMemo, useState} from 'react';
import {useEduData} from "@/app/edu/context";
import axios from "axios";
import Swal from "sweetalert2";

// Types
type CalendarEvent = {
    id?: string;
    title: string;
    date: string; // YYYY-MM-DD
    start: string; // HH:mm
    end: string;   // HH:mm
    room?: number;
    teacher?: string;
    subject?: string;
    status?: string;
};

// Helpers
const pad = (n: number) => n.toString().padStart(2, '0');
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseTimeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return (h * 60) + (m || 0);
};

const getMonday = (d: Date) => {
    const dt = new Date(d);
    const day = dt.getDay(); // 0 Sun, 1 Mon, ...
    const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
    dt.setDate(dt.getDate() + diff);
    dt.setHours(0, 0, 0, 0);
    return dt;
};

const indoDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const eventColors = [
    'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200',
    'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-200',
    'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200',
    'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-200',
    'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200',
    'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-pink-200',
    'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-200'
];

export default function JadwalSiswa() {
    const {user, student, schedules, rooms} = useEduData();

    // View state
    const [mySchedule, setMySchedule] = useState<any>()
    const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
    const weekStart = useMemo(() => getMonday(currentDate), [currentDate]);
    const weekDays: Date[] = useMemo(() => Array.from({length: 7}, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    }), [weekStart]);

    const startHour = 7; // 07:00
    const endHour = 17;  // 17:00
    const hourHeight = 64; // px per hour
    const gridTotalMinutes = (endHour - startHour) * 60;
    const timeLabels = useMemo(() => Array.from({length: (endHour - startHour) + 1}, (_, i) => `${pad(startHour + i)}:00`), []);

    // Derive loading state from edu context
    const isFetching = schedules === undefined || schedules === null;
    const isCalendarLoading = isFetching;

    // Keep mySchedule in sync with edu context
    useEffect(() => {
        if (!schedules) return;
        const scheduleList = schedules.filter((s: any) => s.created_by === user?.id);
        setMySchedule(scheduleList);
    }, [schedules, user?.id]);

    // Compute events for the current week directly from `schedules` provided by edu context
    const eventsForWeek: CalendarEvent[] = useMemo(() => {
        if (!mySchedule || !Array.isArray(mySchedule)) return [];
        const weekSet = new Set(weekDays.map(toDateKey));
        const out: CalendarEvent[] = [];
        mySchedule.forEach((s: any) => {
            const dateKey = s.day;
            if (!weekSet.has(dateKey)) return;
            const start = (s.start_time || '').slice(0, 5) || '07:00';
            const end = (s.end_time || '').slice(0, 5) || '08:00';
            out.push({
                id: s.id,
                title: s.title || 'Kegiatan',
                date: dateKey,
                start,
                end,
                room: Number(s.room?.id ?? 0),
                teacher: s.creator?.name || s.creator?.username,
            })
        })
        return out;
    }, [mySchedule, weekDays]);

    // Modal state for add/edit
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<{
        date: string;
        title: string;
        start: string;
        end: string;
        room?: number;
        teacher?: string;
        subject?: string;
        status?: string
    }>(() => {
        const todayKey = toDateKey(weekStart);
        return {
            date: todayKey,
            title: '',
            start: '09:00',
            end: '10:00',
            room: 0,
            teacher: '',
            subject: '',
            status: 'akan_datang'
        };
    });

    const [loading, setLoading] = useState(false);

    const resetModal = () => {
        setModalMode('add');
        setEditingId(null);
        setForm(f => ({...f, title: '', room: 0, teacher: '', subject: '', status: 'akan_datang'}));
    }

    const openAdd = (dateKey?: string, time?: string) => {
        setModalMode('add');
        setEditingId(null);
        setForm(f => ({...f, date: dateKey || f.date, start: time || f.start}));
        setShowModal(true);
    }

    const openEdit = (ev: CalendarEvent) => {
        setModalMode('edit');
        setEditingId(ev.id ?? null);
        // Try to find room id or name
        const roomObj = rooms?.find((r: any) => r.name === String(ev.room) || r.id === ev.room);
        const numericRoom = typeof ev.room === 'number' ? ev.room : Number(ev.room || 0);
        setForm({
            title: ev.title,
            date: ev.date,
            start: ev.start,
            end: ev.end,
            room: roomObj?.id ?? numericRoom ?? 0,
            teacher: ev.teacher || '',
            subject: ev.subject || '',
            status: ev.status || 'akan_datang'
        });
        setShowModal(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.date || !form.start || !form.end) return;

        setLoading(true);
        try {
            if (modalMode === 'add') {
                const body = {
                    title: form.title,
                    day: form.date,
                    start_time: form.start,
                    end_time: form.end,
                    room_id: form.room || 1,
                    created_by: user?.id || 1,
                }

                const res = await axios.post('/api/jadwal', body);
                if (res.status === 200 || res.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Jadwal berhasil ditambahkan.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            } else if (modalMode === 'edit' && editingId) {
                // editingId was created as `sch-${id}` earlier; try to extract numeric id if present
                const id = editingId.startsWith('sch-') ? editingId.replace('sch-', '') : editingId;
                const body = {
                    id: id,
                    title: form.title,
                    day: form.date,
                    start_time: form.start,
                    end_time: form.end,
                    room_id: form.room || 1,
                    created_by: user?.id || 1,
                }

                const res = await axios.put(`/api/jadwal/${id}`, body);
                if (res.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Jadwal berhasil diperbarui.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            }
        } catch (err) {
            console.error('Gagal menyimpan jadwal:', err);
            Swal.fire({icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat menyimpan jadwal.'});
        } finally {
            setLoading(false);
            setShowModal(false);
            resetModal();
            // refresh page to let edu context re-fetch data
            window.location.reload();
        }
    }

    const handleDelete = async () => {
        if (!editingId) return;
        const id = editingId.startsWith('sch-') ? editingId.replace('sch-', '') : editingId;
        const confirmed = await Swal.fire({
            icon: 'warning',
            title: 'Hapus?',
            text: 'Yakin ingin menghapus jadwal ini?',
            showCancelButton: true
        });
        if (!confirmed.isConfirmed) return;
        try {
            const res = await axios.delete(`/api/jadwal/${id}`);
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Terhapus',
                    text: 'Jadwal berhasil dihapus.',
                    timer: 1200,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error('Gagal menghapus jadwal:', err);
            Swal.fire({icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat menghapus jadwal.'});
        } finally {
            setShowModal(false);
            resetModal();
            window.location.reload();
        }
    }

    // Navigation
    const goPrevWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        setCurrentDate(d);
    }
    const goNextWeek = () => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        setCurrentDate(d);
    }
    const goToday = () => setCurrentDate(new Date());

    // Render helpers
    const eventColor = (index: number) => eventColors[index % eventColors.length];

    const dayEvents = (dateKey: string) => eventsForWeek.filter(e => e.date === dateKey);

    return (
        <>
            {isFetching ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
                </div>
            ) : (
                <div className="overflow-y-auto min-h-screen">
                    <DashHeader student={student} user={user}/>

                    {/* Toolbar */}
                    <section className="w-full p-4">
                        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex flex-col gap-3">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                                        <button
                                            onClick={goPrevWeek}
                                            className="p-2.5 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
                                            aria-label="Minggu sebelumnya"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-700"/>
                                        </button>
                                        <button
                                            onClick={goNextWeek}
                                            className="p-2.5 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200"
                                            aria-label="Minggu berikutnya"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-700"/>
                                        </button>
                                    </div>

                                    <button
                                        onClick={goToday}
                                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Hari ini
                                    </button>

                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <CalendarIcon className="w-4 h-4 text-blue-600"/>
                                        <span className="text-sm font-medium text-gray-700">
                                            {weekDays[0].toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long'
                                            })} - {weekDays[6].toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => openAdd(toDateKey(weekDays[0]))}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                >
                                    <Plus className="w-4 h-4"/> Tambah Kegiatan
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Week calendar grid */}
                    <section className="w-full px-4 pb-8">
                        {isCalendarLoading ? (
                            <div className="flex items-center justify-center min-h-[300px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-0 shadow-md border border-gray-100 overflow-hidden">
                                {/* Header row: empty time col + days */}
                                <div className="grid" style={{gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)`}}>
                                    <div className="border-b border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">Waktu</div>
                                    {weekDays.map((d, i) => (
                                        <div key={i} className="border-b border-gray-200 bg-gray-50 p-3 text-sm font-medium">
                                            {indoDays[i]} <span className="text-gray-500">{d.getDate()}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Body: time labels + day columns */}
                                <div className="grid relative" style={{gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)`}}>
                                    {/* Time labels */}
                                    <div className="relative">
                                        {timeLabels.map((t) => (
                                            <div key={t} className="h-16 border-b border-gray-100 text-[11px] text-gray-500 pr-2 flex justify-end items-start pt-2">
                                                {t}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Day columns */}
                                    {weekDays.map((d, idxDay) => {
                                        const dateKey = toDateKey(d);
                                        const evts = dayEvents(dateKey);
                                        return (
                                            <div key={idxDay} className="relative border-l border-gray-100">
                                                {/* hour grid lines */}
                                                {timeLabels.map((t) => (
                                                    <div key={t} className="h-16 border-b border-gray-100"/>
                                                ))}

                                                {/* events */}
                                                <div className="absolute inset-0">
                                                    {evts.map((ev, index) => {
                                                        const startMin = Math.max(0, parseTimeToMinutes(ev.start) - startHour * 60);
                                                        const endMin = Math.min(gridTotalMinutes, parseTimeToMinutes(ev.end) - startHour * 60);
                                                        const top = (startMin / gridTotalMinutes) * (gridTotalMinutes / 60 * hourHeight);
                                                        const height = Math.max(28, ((endMin - startMin) / gridTotalMinutes) * (gridTotalMinutes / 60 * hourHeight));
                                                        return (
                                                            <div
                                                                key={ev.id}
                                                                className={`absolute left-2 right-2 rounded-md shadow-sm p-2 text-white ${eventColor(index)} cursor-pointer hover:shadow-md`}
                                                                style={{ top: `${top}px`, height: `${height}px`, margin: '4px' }}
                                                                title={`${ev.title} • ${ev.start} - ${ev.end}`}
                                                                onClick={() => openEdit(ev)}
                                                                onDoubleClick={() => openAdd(dateKey, ev.start)}
                                                            >
                                                                <div className="text-xs font-semibold truncate">{ev.title}</div>
                                                                <div className="text-[10px] opacity-90 truncate">{ev.start} - {ev.end}</div>
                                                                {ev.room && (
                                                                    <div className="text-[10px] opacity-90 truncate flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3"/>
                                                                        {rooms?.find((r: any) => r.id == ev.room)?.name || ev.room}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                {/* click to add quick */}
                                                <button className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded-md border text-[10px] hover:bg-white" onClick={() => openAdd(dateKey)}>
                                                    + Kegiatan
                                                </button>
                                            </div>
                                        )
                                    })}

                                    {/* Empty state when no events at all */}
                                    {eventsForWeek.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                                                Belum ada kegiatan pada minggu ini.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Add/Edit Event Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        {modalMode === 'add' ? (
                                            <>
                                                <Plus className="w-5 h-5 text-orange-500" />
                                                Tambah Kegiatan
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 className="w-5 h-5 text-blue-500" />
                                                Edit Kegiatan
                                            </>
                                        )}
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                                            <input
                                                type="date"
                                                value={form.date}
                                                onChange={e => setForm(f => ({...f, date: e.target.value}))}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran / Kegiatan</label>
                                            <input
                                                type="text"
                                                value={form.title}
                                                onChange={e => setForm(f => ({...f, title: e.target.value}))}
                                                placeholder="Contoh: Matematika"
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Mulai</label>
                                                <input
                                                    type="time"
                                                    value={form.start}
                                                    onChange={e => setForm(f => ({...f, start: e.target.value}))}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Selesai</label>
                                                <input
                                                    type="time"
                                                    value={form.end}
                                                    onChange={e => setForm(f => ({...f, end: e.target.value}))}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Ruang</label>
                                                <select
                                                    value={form.room}
                                                    onChange={e => setForm(f => ({
                                                        ...f,
                                                        room: e.target.value === '' ? 0 : Number(e.target.value)
                                                    }))}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                >
                                                    <option value="">Pilih Ruang</option>
                                                    {rooms && rooms.map((room: any) => (
                                                        <option key={room.id} value={room.id}>{room.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                                <select
                                                    value={form.status}
                                                    onChange={e => setForm(f => ({...f, status: e.target.value}))}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                >
                                                    <option value="akan_datang">Akan Datang</option>
                                                    <option value="berlangsung">Sedang Berlangsung</option>
                                                    <option value="selesai">Selesai</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
                                        {modalMode === 'edit' ? (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Hapus
                                            </button>
                                        ) : <div />}

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(false);
                                                    resetModal();
                                                }}
                                                className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    'Simpan'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}