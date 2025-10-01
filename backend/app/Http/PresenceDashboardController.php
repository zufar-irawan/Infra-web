<?php

namespace App\Http\Controllers;

use App\Models\AbsenSiswa;
use Illuminate\Http\Request;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\Setting;
use Carbon\Carbon;

class PresenceDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        Carbon::setLocale('id'); 
        $today = Carbon::now()->format('Y-m-d');
        $todayFormatted = Carbon::now()->translatedFormat('d F Y');
        $kelasActivated = Kelas::count();
        $guruActivated = Guru::count();
        $siswaActivated = Siswa::count();

        // Ambil setting jam absen
        $setting = Setting::first();
        $jamAbsen = $setting ? Carbon::parse($setting->jam_masuk_siswa) : Carbon::now();

        // Hitung siswa yang hadir (sudah absen masuk)
        $siswaHadir = AbsenSiswa::where('tanggal', $today)
            ->where('status', 'absen_masuk')
            ->count();

        // Hitung siswa yang terlambat
        $siswaTerlambat = AbsenSiswa::where('tanggal', $today)
            ->where('status', 'absen_masuk')
            ->where('status_masuk', 'telat')
            ->count();

        // Hitung siswa yang tidak hadir
        // Total siswa - (yang sudah absen + yang izin/sakit)
        $siswaTidakHadir = $siswaActivated - (
            AbsenSiswa::where('tanggal', $today)
                ->whereIn('status', ['absen_masuk', 'izin', 'sakit'])
                ->count()
        );

        $clockInToday = AbsenSiswa::where('tanggal', $today)->where('status', 'absen_masuk')->count();
        $clockOutToday = AbsenSiswa::where('tanggal', $today)->where('status', 'absen_pulang')->count();
        
        $chartKelasCount = Kelas::orderBy('created_at', 'DESC')->withCount('siswa')->pluck('siswa_count');
        $chartKelasLabel = Kelas::orderBy('created_at', 'DESC')->pluck('nama');
        
        // Rekap Siswa Hadir per Kelas
        $rekapHadirPerKelas = Kelas::withCount(['siswa as hadir_count' => function($query) use ($today) {
            $query->whereHas('absensi', function($q) use ($today) {
                $q->where('tanggal', $today)
                  ->where('status', 'absen_masuk')
                  ->where('status_masuk', 'tepat_waktu');
            });
        }])->get();

        // Rekap Siswa Terlambat per Kelas
        $rekapTerlambatPerKelas = Kelas::withCount(['siswa as terlambat_count' => function($query) use ($today) {
            $query->whereHas('absensi', function($q) use ($today) {
                $q->where('tanggal', $today)
                  ->where('status', 'absen_masuk')
                  ->where('status_masuk', 'telat');
            });
        }])->get();

        // Rekap Siswa Tidak Hadir per Kelas
        $rekapTidakHadirPerKelas = Kelas::withCount(['siswa as tidak_hadir_count' => function($query) use ($today) {
            $query->whereDoesntHave('absensi', function($q) use ($today) {
                $q->where('tanggal', $today)
                  ->whereIn('status', ['absen_masuk', 'izin', 'sakit']);
            });
        }])->get();
        
        return view('website.dashboard.index')->with([
            'today'=> $todayFormatted,
            'kelasActivated' => $kelasActivated,
            'guruActivated' => $guruActivated,
            'siswaActivated' => $siswaActivated,
            'clockInToday' => $clockInToday,
            'clockOutToday' => $clockOutToday,
            'chartKelasCount' => $chartKelasCount,
            'chartKelasLabel' => $chartKelasLabel,
            'siswaHadir' => $siswaHadir,
            'siswaTerlambat' => $siswaTerlambat,
            'siswaTidakHadir' => $siswaTidakHadir,
            'rekapHadirPerKelas' => $rekapHadirPerKelas,
            'rekapTerlambatPerKelas' => $rekapTerlambatPerKelas,
            'rekapTidakHadirPerKelas' => $rekapTidakHadirPerKelas,
        ]);
    }
}
