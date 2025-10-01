<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;
use App\Models\PresenceStudentPresence as AbsenSiswa;
use App\Models\PresenceStudent as Siswa;
use App\Models\PresenceClass as Kelas;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\AbsenSiswaDateExport;
use App\Exports\AbsenSiswaRekapExport;
use App\Exports\DetailAbsensiSiswaExport;
use Maatwebsite\Excel\Facades\Excel;

class PresenceReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view presence by date', ['only' => [
            'reportDate',
            'reportDateDatatable',
            'reportDateExport'
        ]]);
    }

    // LAPORAN BY TANGGAL
    public function reportDate()
    {
        return view('website.report.date');
    }

    public function reportDateDatatable(Request $request)
    {
        $presences = AbsenSiswa::with(['siswa.kelas'])
            ->when($request->date, function ($query) use ($request) {
                $query->where('tanggal', $request->date);
            })
            ->orderBy('tanggal', 'DESC');

        return DataTables::of($presences)
            ->addIndexColumn()
            ->addColumn('nis', fn($row) => $row->siswa->nis ?? '-')
            ->addColumn('nama', fn($row) => $row->siswa->nama ?? '-')
            ->addColumn('kelas', fn($row) => $row->siswa && $row->siswa->kelas ? $row->siswa->kelas->nama : '-')
            ->editColumn('jam_pulang', fn($data) => empty($data->jam_pulang) ? '-' : $data->jam_pulang)
            ->addColumn('tanggal', fn($row) => $row->tanggal ?? '-')
            ->addColumn('jam_masuk', fn($row) => $row->jam_masuk ?? '-')
            ->addColumn('status', fn($row) => $row->status ?? '-')
            ->addColumn('status_masuk', fn($row) => $row->status_masuk ?? '-')
            ->addColumn('keterangan', fn($row) => $row->keterangan ?? '-')
            ->make(true);
    }

    public function reportDateExport(Request $request)
    {
        $date = Carbon::parse($request->date);
        $presences = AbsenSiswa::where('tanggal', $request->date)
            ->with(['siswa.kelas'])
            ->orderBy('tanggal', 'DESC')
            ->get();

        if ($request->submit == "pdf") {
            $pdf = Pdf::loadView('website.report.report_date_pdf', [
                'presences' => $presences,
                'date' => $date
            ])->setPaper('a4', 'landscape');
            return $pdf->stream();
        }

        if ($request->submit == "excel") {
            return Excel::download(
                new AbsenSiswaDateExport($presences, $date),
                'laporan_absensi_siswa_' . $date->format('d_F_Y') . '.xlsx'
            );
        }
    }

    // LAPORAN BY SISWA (DAFTAR)
    public function reportStudent()
    {
        $kelasList = Kelas::orderBy('nama')->get();
        return view('website.report.student', compact('kelasList'));
    }
    
    // // LAPORAN BY SISWA (DAFTAR)
    // public function reportStudent()
    // {
    //     $kelasList = Kelas::orderBy('nama')->get();
    //     return view('website.report.student', compact('kelasList'));
    // }

    public function studentDatatable(Request $request)
    {
        $query = Siswa::with('kelas')
            ->when($request->kelas_id, fn($q) => $q->where('kelas_id', $request->kelas_id));
        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('kelas', fn($siswa) => $siswa->kelas->nama ?? '-')
            ->addColumn('gender', function ($siswa) {
                return $siswa->gender == 1
                    ? "<span class='badge badge-success'>Pria</span>"
                    : "<span class='badge badge-danger'>Wanita</span>";
            })
            ->addColumn('nomor_orang_tua', fn($siswa) => $siswa->telepon_wali ?? '-')
            ->addColumn('aksi', function ($row) {
                return '<a href="' . route('laporan.siswa.detailpersiswa', $row->id) . '" class="btn btn-primary btn-sm text-white font-weight-bold">Detail Siswa</a>';
            })
            ->rawColumns(['gender', 'aksi'])
            ->make(true);
    }

    public function studentPresence($id)
    {
        $siswa = Siswa::with('kelas')->findOrFail($id);
        return view('website.report.student_presence', compact('siswa'));
    }

    public function studentPresenceDatatable(Request $request, $id)
    {
        $query = AbsenSiswa::with(['siswa.kelas'])
            ->where('siswa_id', $id)
            ->when($request->start_date && $request->end_date, function($q) use ($request) {
                $q->whereBetween('tanggal', [$request->start_date, $request->end_date]);
            })
            ->orderBy('tanggal', 'DESC');

        return DataTables::of($query)
            ->addIndexColumn()
            ->editColumn('tanggal', function($row) {
                return $row->tanggal ? Carbon::parse($row->tanggal)->format('d-m-Y') : '-';
            })
            ->editColumn('jam_masuk', function($row) {
                return $row->jam_masuk ? Carbon::parse($row->jam_masuk)->format('H:i:s') : '-';
            })
            ->editColumn('jam_pulang', function($row) {
                return $row->jam_pulang ? Carbon::parse($row->jam_pulang)->format('H:i:s') : '-';
            })
            ->editColumn('status', function($row) {
                switch ($row->status) {
                    case 'absen_masuk':
                        return 'Absen Masuk';
                    case 'absen_pulang':
                        return 'Absen Pulang';
                    case 'izin':
                        return 'Izin';
                    case 'sakit':
                        return 'Sakit';
                    case 'alfa':
                        return 'Alfa';
                    default:
                        return '-';
                }
            })
            ->editColumn('status_masuk', function($row) {
                return $row->status_masuk == 'telat' ? 'Telat' : ($row->status_masuk == 'tepat_waktu' ? 'Tepat Waktu' : '-');
            })
            ->rawColumns(['status', 'status_masuk'])
            ->make(true);
    }

    // REKAP ABSENSI SISWA TANPA SUBKELAS
    public function rekapAbsensiSiswa()
    {
        $kelasList = Kelas::orderBy('nama')->get();
        return view('website.report.rekap_absensi_siswa', compact('kelasList'));
    }

    public function rekapAbsensiSiswaDatatable(Request $request)
    {
        $query = Siswa::with(['kelas', 'absensi' => function($q) use ($request) {
            if ($request->start_date && $request->end_date) {
                $q->whereBetween('tanggal', [$request->start_date, $request->end_date]);
            }
        }])
            ->when($request->kelas_id, fn($q) => $q->where('kelas_id', $request->kelas_id));

        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('kelas', fn($siswa) => $siswa->kelas->nama ?? '-')
            ->addColumn('masuk', function ($siswa) {
                return $siswa->absensi->where('status', 'absen_masuk')
                    ->where('status_masuk', 'tepat_waktu')
                    ->count();
            })
            ->addColumn('telat', function ($siswa) {
                return $siswa->absensi->where('status', 'absen_masuk')
                    ->where('status_masuk', 'telat')
                    ->count();
            })
            ->addColumn('sakit', function ($siswa) {
                return $siswa->absensi->where('status_masuk', 'sakit')->count();
            })
            ->addColumn('ijin', function ($siswa) {
                return $siswa->absensi->where('status_masuk', 'izin')->count();
            })
            ->addColumn('alfa', function ($siswa) {
                return $siswa->absensi->where('status_masuk', 'alfa')->count();
            })
            ->make(true);
    }

    public function rekapAbsensiSiswaExport(Request $request)
    {
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        $kelasId = $request->kelas_id;

        $query = Siswa::with(['kelas', 'absensi' => function($q) use ($startDate, $endDate) {
            if ($startDate && $endDate) {
                $q->whereBetween('tanggal', [$startDate, $endDate]);
            }
        }])
            ->when($kelasId, fn($q) => $q->where('kelas_id', $kelasId));
        $siswaList = $query->get();

        $rekap = [];
        foreach ($siswaList as $siswa) {
            $rekap[] = [
                'nis' => $siswa->nis,
                'nama' => $siswa->nama,
                'kelas' => $siswa->kelas->nama ?? '-',
                'masuk' => $siswa->absensi->where('status', 'absen_masuk')
                    ->where('status_masuk', 'tepat_waktu')
                    ->count(),
                'telat' => $siswa->absensi->where('status', 'absen_masuk')
                    ->where('status_masuk', 'telat')
                    ->count(),
                'sakit' => $siswa->absensi->where('status_masuk', 'sakit')->count(),
                'ijin' => $siswa->absensi->where('status_masuk', 'izin')->count(),
                'alfa' => $siswa->absensi->where('status_masuk', 'alfa')->count(),
            ];
        }

        $kelasNama = $kelasId ? (Kelas::find($kelasId)->nama ?? '-') : '-';

        if ($request->submit == 'excel') {
            return Excel::download(
                new AbsenSiswaRekapExport($rekap, $kelasNama, '-', $startDate, $endDate),
                'rekap_absensi_siswa_' . $kelasNama . '_' . date('dMY', strtotime($startDate)) . '_sd_' . date('dMY', strtotime($endDate)) . '.xlsx'
            );
        } else {
            $pdf = Pdf::loadView('website.report.rekap_absensi_siswa_pdf', [
                'rekap' => $rekap,
                'kelasNama' => $kelasNama,
                'startDate' => $startDate,
                'endDate' => $endDate,
            ])->setPaper('A4', 'landscape');
            return $pdf->stream('rekap_absensi_siswa_' . $kelasNama . '_' . date('dMY', strtotime($startDate)) . '_sd_' . date('dMY', strtotime($endDate)) . '.pdf');
        }
    }

    // DETAIL ABSENSI SISWA (UNTUK TABEL HORIZONTAL SEMUA SISWA)
    public function detailAbsensiSiswa(Request $request)
    {
        $kelasList = Kelas::orderBy('nama')->get();
        return view('website.report.detail_absensi_siswa', compact('kelasList'));
    }

    // AJAX datatable jika pakai datatables di blade utama
    public function detailAbsensiSiswaDatatable(Request $request)
    {
        $bulan = $request->bulan ? Carbon::parse($request->bulan . '-01') : Carbon::now()->startOfMonth();
        $kelasId = $request->kelas_id;

        $startDate = $bulan->copy()->startOfMonth();
        $endDate = $bulan->copy()->endOfMonth();
        $dates = [];
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
        }

        $query = Siswa::with(['kelas', 'absensi' => function ($q) use ($startDate, $endDate) {
            $q->whereBetween('tanggal', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        }])
            ->when($kelasId, fn($q) => $q->where('kelas_id', $kelasId));

        $data = [];
        foreach ($query->get() as $siswa) {
            $row = [
                'nis' => $siswa->nis,
                'nama' => $siswa->nama,
                'kelas' => $siswa->kelas->nama ?? '-',
            ];
            foreach ($dates as $tgl) {
                $absen = optional($siswa->absensi)->firstWhere('tanggal', $tgl);
                if (!$absen) {
                    $row[$tgl] = '-';
                } else {
                    if ($absen->status == 'absen_masuk' && $absen->status_masuk == 'telat') {
                        $row[$tgl] = '<span class="badge badge-info">Terlambat</span>';
                    } elseif ($absen->status_masuk == 'sakit') {
                        $row[$tgl] = '<span class="badge badge-warning">Sakit</span>';
                    } elseif ($absen->status_masuk == 'izin') {
                        $row[$tgl] = '<span class="badge badge-secondary">Izin</span>';
                    } elseif ($absen->status_masuk == 'alfa') {
                        $row[$tgl] = '<span class="badge badge-danger">Alfa</span>';
                    } else {
                        $row[$tgl] = '<span class="badge badge-primary">Masuk</span>';
                    }
                }
            }
            $data[] = $row;
        }

        return response()->json(['data' => $data]);
    }

    // EXPORT EXCEL/PDF DETAIL ABSENSI SISWA
    public function detailAbsensiSiswaExport(Request $request)
    {
        $bulan = $request->bulan ? Carbon::parse($request->bulan . '-01') : Carbon::now()->startOfMonth();
        $kelasId = $request->kelas_id;

        $kelasNama = $kelasId ? (Kelas::find($kelasId)->nama ?? '-') : 'Semua';

        $startDate = $bulan->copy()->startOfMonth();
        $endDate = $bulan->copy()->endOfMonth();

        $dates = [];
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
        }

        $query = Siswa::with(['kelas', 'absensi' => function ($q) use ($startDate, $endDate) {
            $q->whereBetween('tanggal', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        }])
            ->when($kelasId, fn($q) => $q->where('kelas_id', $kelasId));

        $rekap = [];
        foreach ($query->get() as $siswa) {
            $row = [
                'nis' => $siswa->nis,
                'nama' => $siswa->nama,
                'kelas' => $siswa->kelas->nama ?? '-',
                'absensi' => [],
            ];
            foreach ($dates as $tgl) {
                $absen = $siswa->absensi->firstWhere('tanggal', $tgl);
                if (!$absen) {
                    $row['absensi'][$tgl] = '-';
                } else {
                    if ($absen->status == 'absen_masuk' && $absen->status_masuk == 'telat') {
                        $row['absensi'][$tgl] = 'telat';
                    } elseif ($absen->status == 'absen_masuk') {
                        $row['absensi'][$tgl] = 'masuk';
                    } elseif ($absen->status == 'sakit') {
                        $row['absensi'][$tgl] = 'sakit';
                    } elseif ($absen->status == 'izin') {
                        $row['absensi'][$tgl] = 'izin';
                    } elseif ($absen->status == 'alfa') {
                        $row['absensi'][$tgl] = 'alfa';
                    } else {
                        $row['absensi'][$tgl] = $absen->status;
                    }
                }
            }
            $rekap[] = $row;
        }

        $bulanStr = $bulan->format('Y-m');

        if ($request->submit == 'excel') {
            return Excel::download(
                new DetailAbsensiSiswaExport($rekap, $kelasNama, $bulanStr, $dates),
                'detail_absensi_siswa_' . $kelasNama . '_' . $bulanStr . '.xlsx'
            );
        } else {
            $pdf = Pdf::loadView('website.report.detail_absensi_siswa_pdf', [
                'rekap' => $rekap,
                'kelasNama' => $kelasNama,
                'bulan' => $bulanStr,
                'dates' => $dates,
            ])->setPaper('A4', 'landscape');
            return $pdf->stream('detail_absensi_siswa_' . $kelasNama . '_' . $bulanStr . '.pdf');
        }
    }
}
