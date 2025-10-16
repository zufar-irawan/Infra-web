"use client";

import { Clock, MapPin, Plus, Upload, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import DashHeader from "@/app/components/DashHeader"
import React, { useMemo, useRef, useState } from 'react';
import { useEduData } from "@/app/edu/context";

// Types
 type CalendarEvent = {
   id: string;
   title: string;
   date: string; // YYYY-MM-DD
   start: string; // HH:mm
   end: string;   // HH:mm
   room?: string;
   teacher?: string;
   subject?: string;
   status?: "berlangsung" | "selesai" | "akan_datang" | string;
 };

// Helpers
 const pad = (n: number) => n.toString().padStart(2, '0');
 const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 const parseTimeToMinutes = (t: string) => {
   const [h, m] = t.split(":").map(Number);
   return (h * 60) + (m || 0);
 };
 const minutesToTime = (m: number) => `${pad(Math.floor(m/60))}:${pad(m%60)}`;

 const getMonday = (d: Date) => {
   const dt = new Date(d);
   const day = dt.getDay(); // 0 Sun, 1 Mon, ...
   const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
   dt.setDate(dt.getDate() + diff);
   dt.setHours(0,0,0,0);
   return dt;
 };

 const indoDays = ["Senin","Selasa","Rabu","Kamis","Jumat"];
 const indoDayToIndex = (name: string) => indoDays.indexOf(name); // 0..4

export default function JadwalSiswa() {
  const { user, student } = useEduData();

  // View state
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const weekStart = useMemo(() => getMonday(currentDate), [currentDate]);
  const weekDays: Date[] = useMemo(() => Array.from({length: 5}, (_,i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  }), [weekStart]);

  const startHour = 7; // 07:00
  const endHour = 17;  // 17:00
  const hourHeight = 64; // px per hour
  const gridTotalMinutes = (endHour - startHour) * 60;
  const timeLabels = useMemo(() => Array.from({length: (endHour - startHour) + 1}, (_,i) => `${pad(startHour + i)}:00`), []);

  // Dummy initial jadwal mapped to current week (Mon-Fri)
  const jadwalData = {
    "Senin": [
      { mapel: "Matematika", jam: "07:00 - 08:30", ruang: "R. 201", guru: "John Doe, S.Pd.", status: "selesai" },
      { mapel: "Bahasa Indonesia", jam: "08:45 - 10:15", ruang: "R. 202", guru: "Jane Smith, S.Pd.", status: "selesai" },
      { mapel: "DKV", jam: "10:30 - 12:00", ruang: "Lab. Komputer", guru: "Reine Smith, S.Kom.", status: "berlangsung" },
      { mapel: "Bahasa Inggris", jam: "13:00 - 14:30", ruang: "R. 203", guru: "Jane Doe, S.S.", status: "akan_datang" },
    ],
    "Selasa": [
      { mapel: "PKK", jam: "07:00 - 08:30", ruang: "R. 204", guru: "Jack Wilson, S.Pd.", status: "akan_datang" },
      { mapel: "Kewirausahaan", jam: "08:45 - 10:15", ruang: "R. 205", guru: "Jack Smith, S.Pd.", status: "akan_datang" },
      { mapel: "Matematika", jam: "10:30 - 12:00", ruang: "R. 201", guru: "John Doe, S.Pd.", status: "akan_datang" },
    ],
    "Rabu": [
      { mapel: "Bahasa Inggris", jam: "07:00 - 08:30", ruang: "R. 203", guru: "Jane Doe, S.S.", status: "akan_datang" },
      { mapel: "DKV", jam: "08:45 - 10:15", ruang: "Lab. Komputer", guru: "Reine Smith, S.Kom.", status: "akan_datang" },
      { mapel: "Bahasa Indonesia", jam: "10:30 - 12:00", ruang: "R. 202", guru: "Jane Smith, S.Pd.", status: "akan_datang" },
    ],
    "Kamis": [
      { mapel: "Kewirausahaan", jam: "07:00 - 08:30", ruang: "R. 205", guru: "Jack Smith, S.Pd.", status: "akan_datang" },
      { mapel: "PKK", jam: "08:45 - 10:15", ruang: "R. 204", guru: "Jack Wilson, S.Pd.", status: "akan_datang" },
      { mapel: "Matematika", jam: "10:30 - 12:00", ruang: "R. 201", guru: "John Doe, S.Pd.", status: "akan_datang" },
    ],
    "Jumat": [
      { mapel: "DKV", jam: "07:00 - 08:30", ruang: "Lab. Komputer", guru: "Reine Smith, S.Kom.", status: "akan_datang" },
      { mapel: "Bahasa Indonesia", jam: "08:45 - 10:15", ruang: "R. 202", guru: "Jane Smith, S.Pd.", status: "akan_datang" },
    ]
  } as Record<string, Array<{ mapel: string; jam: string; ruang: string; guru: string; status: string }>>;

  const initialEvents: CalendarEvent[] = useMemo(() => {
    const monday = weekDays[0];
    const events: CalendarEvent[] = [];
    indoDays.forEach((dayName, idx) => {
      const dayData = jadwalData[dayName] || [];
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateKey = toDateKey(d);
      dayData.forEach((item, i) => {
        const [s, e] = item.jam.split("-").map(s => s.trim());
        events.push({
          id: `${dateKey}-${i}`,
          title: item.mapel,
          date: dateKey,
          start: s,
          end: e,
          room: item.ruang,
          teacher: item.guru,
          subject: item.mapel,
          status: item.status,
        })
      })
    })
    return events;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart.getTime()]);

  // Master events state (includes imports and added events)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // Update events when week changes (preserve edits and extras within week)
  React.useEffect(() => {
    setEvents(prev => {
      const baseIds = new Set(initialEvents.map(e => e.id));
      const prevMap = new Map(prev.map(e => [e.id, e] as const));
      // Replace base events with edited versions if present
      const mergedBase = initialEvents.map(e => prevMap.get(e.id) ?? e);
      // Keep user-added/imported events that are not base and are within current week
      const weekDates = new Set(weekDays.map(toDateKey));
      const extras = prev.filter(e => !baseIds.has(e.id) && weekDates.has(e.date));
      return [...mergedBase, ...extras];
    })
  }, [initialEvents, weekDays]);

  // Import (CSV/JSON)
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => inputRef.current?.click();

  const parseCSV = (text: string): CalendarEvent[] => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return [];
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const idx = (name: string) => header.indexOf(name);
    const out: CalendarEvent[] = [];
    for (let i=1;i<lines.length;i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      const date = cols[idx('date')] || cols[idx('tanggal')];
      const start = cols[idx('start')] || cols[idx('jam_mulai')] || cols[idx('mulai')];
      const end = cols[idx('end')] || cols[idx('jam_selesai')] || cols[idx('selesai')];
      const title = cols[idx('title')] || cols[idx('mapel')] || cols[idx('kegiatan')] || 'Kegiatan';
      const room = cols[idx('room')] || cols[idx('ruang')];
      const teacher = cols[idx('teacher')] || cols[idx('guru')];
      const subject = cols[idx('subject')] || cols[idx('mapel')];
      const status = (cols[idx('status')] || 'akan_datang') as CalendarEvent['status'];
      if (!date || !start || !end) continue;
      out.push({
        id: `imp-${date}-${start}-${end}-${i}`,
        title, date, start, end, room, teacher, subject, status
      })
    }
    return out;
  }

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      let imported: CalendarEvent[] = [];
      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          imported = json.map((j:any, i:number) => ({
            id: j.id || `imp-json-${i}`,
            title: j.title || j.mapel || 'Kegiatan',
            date: j.date,
            start: j.start,
            end: j.end,
            room: j.room || j.ruang,
            teacher: j.teacher || j.guru,
            subject: j.subject || j.mapel,
            status: j.status || 'akan_datang'
          })).filter((j:any) => j.date && j.start && j.end)
        }
      } else {
        // default to CSV
        imported = parseCSV(text);
      }
      if (imported.length) {
        const weekDates = new Set(weekDays.map(toDateKey));
        const onlyThisWeek = imported.filter(ev => weekDates.has(ev.date));
        setEvents(prev => [...prev, ...onlyThisWeek]);
      }
    } catch (err) {
      console.error('Import gagal:', err);
    } finally {
      e.target.value = '';
    }
  }

  // Unified Modal: add/edit
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{date: string; title: string; start: string; end: string; room?: string; teacher?: string; subject?: string; status?: string}>(() => {
    const todayKey = toDateKey(weekStart);
    return { date: todayKey, title: '', start: '09:00', end: '10:00', room: '', teacher: '', subject: '', status: 'akan_datang' };
  });

  const resetModal = () => {
    setModalMode('add');
    setEditingId(null);
    setForm(f => ({ ...f, title: '', room: '', teacher: '', subject: '', status: 'akan_datang' }));
  }

  const openAdd = (dateKey?: string, time?: string) => {
    setModalMode('add');
    setEditingId(null);
    setForm(f => ({ ...f, date: dateKey || f.date, start: time || f.start }));
    setShowModal(true);
  }

  const openEdit = (ev: CalendarEvent) => {
    setModalMode('edit');
    setEditingId(ev.id);
    setForm({
      date: ev.date,
      title: ev.title,
      start: ev.start,
      end: ev.end,
      room: ev.room || '',
      teacher: ev.teacher || '',
      subject: ev.subject || '',
      status: ev.status || 'akan_datang',
    });
    setShowModal(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.start || !form.end) return;

    if (modalMode === 'add') {
      const id = `evt-${form.date}-${form.start}-${form.end}-${Math.random().toString(36).slice(2,7)}`;
      setEvents(prev => [...prev, {
        id,
        title: form.title,
        date: form.date,
        start: form.start,
        end: form.end,
        room: form.room,
        teacher: form.teacher,
        subject: form.subject,
        status: form.status as any
      }]);
    } else if (modalMode === 'edit' && editingId) {
      setEvents(prev => prev.map(e => e.id === editingId ? {
        ...e,
        title: form.title,
        date: form.date,
        start: form.start,
        end: form.end,
        room: form.room,
        teacher: form.teacher,
        subject: form.subject,
        status: form.status as any,
      } : e));
    }

    setShowModal(false);
  }

  const handleDelete = () => {
    if (!editingId) return;
    setEvents(prev => prev.filter(e => e.id !== editingId));
    setShowModal(false);
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
  const eventColor = (status?: string) =>
    status === 'berlangsung' ? 'bg-orange-500/90 text-white'
    : status === 'selesai' ? 'bg-emerald-500/90 text-white'
    : 'bg-blue-500/90 text-white';

  const dayEvents = (dateKey: string) => events.filter(e => e.date === dateKey);

  return (
    <>
      {user?.role === 'siswa' && (
        <div className="overflow-y-auto min-h-screen">
          <DashHeader student={student} user={user} />

          {/* Toolbar */}
          <section className="w-full p-4">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={goPrevWeek} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Minggu sebelumnya">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={goNextWeek} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Minggu berikutnya">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button onClick={goToday} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">Hari ini</button>
                  <div className="ml-2 text-sm text-gray-600 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {weekDays[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'long' })} - {weekDays[4].toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input ref={inputRef} type="file" accept=".csv,.json" onChange={onImportFile} className="hidden" />
                  <button onClick={handleImportClick} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                    <Upload className="w-4 h-4" /> Impor Jadwal
                  </button>
                  <button onClick={() => openAdd(toDateKey(weekDays[0]))} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm">
                    <Plus className="w-4 h-4" /> Tambah Kegiatan
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Week calendar grid */}
          <section className="w-full px-4 pb-8">
            <div className="bg-white rounded-2xl p-0 shadow-md border border-gray-100 overflow-hidden">
              {/* Header row: empty time col + days */}
              <div className="grid" style={{ gridTemplateColumns: `80px repeat(5, 1fr)` }}>
                <div className="border-b border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">Waktu</div>
                {weekDays.map((d, i) => (
                  <div key={i} className="border-b border-gray-200 bg-gray-50 p-3 text-sm font-medium">
                    {indoDays[i]} <span className="text-gray-500">{d.getDate()}</span>
                  </div>
                ))}
              </div>

              {/* Body: time labels + day columns */}
              <div className="grid" style={{ gridTemplateColumns: `80px repeat(5, 1fr)` }}>
                {/* Time labels */}
                <div className="relative">
                  {timeLabels.map((t, idx) => (
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
                        <div key={t} className="h-16 border-b border-gray-100" />
                      ))}

                      {/* events */}
                      <div className="absolute inset-0">
                        {evts.map((ev) => {
                          const startMin = Math.max(0, parseTimeToMinutes(ev.start) - startHour*60);
                          const endMin = Math.min(gridTotalMinutes, parseTimeToMinutes(ev.end) - startHour*60);
                          const top = (startMin / gridTotalMinutes) * (gridTotalMinutes/60 * hourHeight);
                          const height = Math.max(28, ((endMin - startMin) / gridTotalMinutes) * (gridTotalMinutes/60 * hourHeight));
                          return (
                            <div
                              key={ev.id}
                              className={`absolute left-1 right-1 rounded-md shadow-sm p-2 ${eventColor(ev.status)} cursor-pointer hover:shadow-md`}
                              style={{ top: `${top}px`, height: `${height}px` }}
                              title={`${ev.title} • ${ev.start} - ${ev.end}`}
                              onClick={() => openEdit(ev)}
                              onDoubleClick={() => openAdd(dateKey, ev.start)}
                            >
                              <div className="text-xs font-semibold truncate">{ev.title}</div>
                              <div className="text-[10px] opacity-90 truncate">{ev.start} - {ev.end}</div>
                              {ev.room && (
                                <div className="text-[10px] opacity-90 truncate flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.room}</div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* click to add quick */}
                      <button
                        className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded-md border text-[10px] hover:bg-white"
                        onClick={() => openAdd(dateKey)}
                      >
                        + Kegiatan
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Add/Edit Event Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-4">
                <h3 className="text-lg font-semibold mb-3">{modalMode === 'add' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
                      <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mata Pelajaran / Kegiatan</label>
                      <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Contoh: Matematika" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mulai</label>
                      <input type="time" value={form.start} onChange={e => setForm(f => ({...f, start: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Selesai</label>
                      <input type="time" value={form.end} onChange={e => setForm(f => ({...f, end: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Ruang</label>
                      <input type="text" value={form.room} onChange={e => setForm(f => ({...f, room: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Guru</label>
                      <input type="text" value={form.teacher} onChange={e => setForm(f => ({...f, teacher: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Status</label>
                      <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="akan_datang">Akan Datang</option>
                        <option value="berlangsung">Sedang Berlangsung</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mapel (opsional)</label>
                      <input type="text" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    {modalMode === 'edit' ? (
                      <button type="button" onClick={handleDelete} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 text-sm hover:bg-red-50">Hapus</button>
                    ) : <span />}
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => { setShowModal(false); resetModal(); }} className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50">Batal</button>
                      <button type="submit" className="px-3 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600">Simpan</button>
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
