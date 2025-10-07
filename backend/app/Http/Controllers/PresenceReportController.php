<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
            'reportDate','reportDateDatatable','reportDateExport'
        ]]);
    }

    /* ===================== LAPORAN BY TANGGAL ===================== */
    public function reportDate()
    {
        // tidak perlu view, hanya info untuk frontend
        return response()->json([
            'success' => true,
            'message' => 'Gunakan endpoint /reports/date/datatable untuk data'
        ]);
    }

    public function reportDateDatatable(Request $request)
    {
        $presences = AbsenSiswa::with(['siswa.kelas'])
            ->when($request->date, fn($q) => $q->where('tanggal',$request->date))
            ->orderBy('tanggal','DESC');

        return DataTables::of($presences)
            ->addIndexColumn()
            ->addColumn('nis', fn($r) => $r->siswa->nis ?? '-')
            ->addColumn('nama', fn($r) => $r->siswa->nama ?? '-')
            ->addColumn('kelas', fn($r) => $r->siswa?->kelas?->nama ?? '-')
            ->editColumn('jam_pulang', fn($r) => $r->jam_pulang ?: '-')
            ->addColumn('tanggal', fn($r) => $r->tanggal ?? '-')
            ->addColumn('jam_masuk', fn($r) => $r->jam_masuk ?? '-')
            ->addColumn('status', fn($r) => $r->status ?? '-')
            ->addColumn('status_masuk', fn($r) => $r->status_masuk ?? '-')
            ->addColumn('keterangan', fn($r) => $r->keterangan ?? '-')
            ->make(true);
    }

    public function reportDateExport(Request $request)
    {
        $date = Carbon::parse($request->date);
        $presences = AbsenSiswa::where('tanggal', $request->date)
            ->with(['siswa.kelas'])
            ->orderBy('tanggal','DESC')
            ->get();

        if ($request->submit === "pdf") {
            $pdf = Pdf::loadView('website.report.report_date_pdf', [
                'presences' => $presences,
                'date'      => $date
            ])->setPaper('a4','landscape');
            return $pdf->download('laporan_absensi_siswa_'.$date->format('d_F_Y').'.pdf');
        }

        if ($request->submit === "excel") {
            return Excel::download(
                new AbsenSiswaDateExport($presences,$date),
                'laporan_absensi_siswa_'.$date->format('d_F_Y').'.xlsx'
            );
        }
    }

    /* ===================== LAPORAN PER SISWA ===================== */
    public function reportStudent()
    {
        $kelasList = Kelas::orderBy('nama')->get();
        return response()->json([
            'success' => true,
            'kelasList' => $kelasList
        ]);
    }

    public function studentDatatable(Request $request)
    {
        $query = Siswa::with('kelas')
            ->when($request->kelas_id, fn($q) => $q->where('kelas_id',$request->kelas_id));

        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('kelas', fn($s) => $s->kelas->nama ?? '-')
            ->addColumn('gender', fn($s) =>
                $s->gender == 1 ? 'Pria' : 'Wanita'
            )
            ->addColumn('nomor_orang_tua', fn($s) => $s->telepon_wali ?? '-')
            ->make(true);
    }

    public function studentPresenceDatatable(Request $request, $id)
    {
        $query = AbsenSiswa::with(['siswa.kelas'])
            ->where('siswa_id',$id)
            ->when($request->start_date && $request->end_date,
                fn($q) => $q->whereBetween('tanggal',[$request->start_date,$request->end_date]))
            ->orderBy('tanggal','DESC');

        return DataTables::of($query)
            ->addIndexColumn()
            ->editColumn('tanggal', fn($r) => $r->tanggal ? Carbon::parse($r->tanggal)->format('d-m-Y') : '-')
            ->editColumn('jam_masuk', fn($r) => $r->jam_masuk ? Carbon::parse($r->jam_masuk)->format('H:i:s') : '-')
            ->editColumn('jam_pulang', fn($r) => $r->jam_pulang ? Carbon::parse($r->jam_pulang)->format('H:i:s') : '-')
            ->editColumn('status', function($r){
                return match($r->status){
                    'absen_masuk'  => 'Absen Masuk',
                    'absen_pulang' => 'Absen Pulang',
                    'izin'         => 'Izin',
                    'sakit'        => 'Sakit',
                    'alfa'         => 'Alfa',
                    default        => '-'
                };
            })
            ->editColumn('status_masuk', fn($r) =>
                $r->status_masuk === 'telat' ? 'Telat'
                : ($r->status_masuk === 'tepat_waktu' ? 'Tepat Waktu' : '-')
            )
            ->make(true);
    }

    /* ===================== REKAP ABSENSI SISWA ===================== */
    public function rekapAbsensiSiswaDatatable(Request $request)
    {
        $query = Siswa::with(['kelas','absensi' => function($q) use ($request){
            if($request->start_date && $request->end_date){
                $q->whereBetween('tanggal',[$request->start_date,$request->end_date]);
            }
        }])
        ->when($request->kelas_id, fn($q) => $q->where('kelas_id',$request->kelas_id));

        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('kelas', fn($s) => $s->kelas->nama ?? '-')
            ->addColumn('masuk', fn($s) =>
                $s->absensi->where('status','absen_masuk')->where('status_masuk','tepat_waktu')->count()
            )
            ->addColumn('telat', fn($s) =>
                $s->absensi->where('status','absen_masuk')->where('status_masuk','telat')->count()
            )
            ->addColumn('sakit', fn($s) =>
                $s->absensi->where('status_masuk','sakit')->count()
            )
            ->addColumn('ijin', fn($s) =>
                $s->absensi->where('status_masuk','izin')->count()
            )
            ->addColumn('alfa', fn($s) =>
                $s->absensi->where('status_masuk','alfa')->count()
            )
            ->make(true);
    }

    public function rekapAbsensiSiswaExport(Request $request)
    {
        $startDate = $request->start_date;
        $endDate   = $request->end_date;
        $kelasId   = $request->kelas_id;

        $siswaList = Siswa::with(['kelas','absensi' => function($q) use ($startDate,$endDate){
            if($startDate && $endDate){
                $q->whereBetween('tanggal',[$startDate,$endDate]);
            }
        }])->when($kelasId, fn($q) => $q->where('kelas_id',$kelasId))->get();

        $rekap = [];
        foreach($siswaList as $s){
            $rekap[] = [
                'nis'   => $s->nis,
                'nama'  => $s->nama,
                'kelas' => $s->kelas->nama ?? '-',
                'masuk' => $s->absensi->where('status','absen_masuk')->where('status_masuk','tepat_waktu')->count(),
                'telat' => $s->absensi->where('status','absen_masuk')->where('status_masuk','telat')->count(),
                'sakit' => $s->absensi->where('status_masuk','sakit')->count(),
                'ijin'  => $s->absensi->where('status_masuk','izin')->count(),
                'alfa'  => $s->absensi->where('status_masuk','alfa')->count(),
            ];
        }

        $kelasNama = $kelasId ? (Kelas::find($kelasId)->nama ?? '-') : '-';

        if($request->submit === 'excel'){
            return Excel::download(
                new AbsenSiswaRekapExport($rekap,$kelasNama,'-',$startDate,$endDate),
                'rekap_absensi_siswa_'.$kelasNama.'_'.date('dMY',strtotime($startDate)).'_sd_'.date('dMY',strtotime($endDate)).'.xlsx'
            );
        }

        $pdf = Pdf::loadView('website.report.rekap_absensi_siswa_pdf',[
            'rekap'     => $rekap,
            'kelasNama' => $kelasNama,
            'startDate' => $startDate,
            'endDate'   => $endDate
        ])->setPaper('A4','landscape');

        return $pdf->download('rekap_absensi_siswa_'.$kelasNama.'_'.date('dMY',strtotime($startDate)).'_sd_'.date('dMY',strtotime($endDate)).'.pdf');
    }

    /* ===================== DETAIL ABSENSI SISWA ===================== */
    public function detailAbsensiSiswaDatatable(Request $request)
    {
        $bulan   = $request->bulan ? Carbon::parse($request->bulan.'-01') : Carbon::now()->startOfMonth();
        $kelasId = $request->kelas_id;

        $startDate = $bulan->copy()->startOfMonth();
        $endDate   = $bulan->copy()->endOfMonth();

        $dates = [];
        for($d=$startDate->copy(); $d->lte($endDate); $d->addDay()){
            $dates[] = $d->format('Y-m-d');
        }

        $query = Siswa::with(['kelas','absensi' => function($q) use ($startDate,$endDate){
            $q->whereBetween('tanggal',[$startDate->format('Y-m-d'),$endDate->format('Y-m-d')]);
        }])->when($kelasId, fn($q) => $q->where('kelas_id',$kelasId));

        $data = [];
        foreach($query->get() as $siswa){
            $row = [
                'nis'   => $siswa->nis,
                'nama'  => $siswa->nama,
                'kelas' => $siswa->kelas->nama ?? '-'
            ];
            foreach($dates as $tgl){
                $absen = $siswa->absensi->firstWhere('tanggal',$tgl);
                if(!$absen){
                    $row[$tgl] = '-';
                }else{
                    if($absen->status == 'absen_masuk' && $absen->status_masuk == 'telat'){
                        $row[$tgl] = 'Terlambat';
                    }elseif($absen->status_masuk == 'sakit'){
                        $row[$tgl] = 'Sakit';
                    }elseif($absen->status_masuk == 'izin'){
                        $row[$tgl] = 'Izin';
                    }elseif($absen->status_masuk == 'alfa'){
                        $row[$tgl] = 'Alfa';
                    }else{
                        $row[$tgl] = 'Masuk';
                    }
                }
            }
            $data[] = $row;
        }

        return response()->json(['dates'=>$dates,'data'=>$data]);
    }

    public function detailAbsensiSiswaExport(Request $request)
    {
        $bulan   = $request->bulan ? Carbon::parse($request->bulan.'-01') : Carbon::now()->startOfMonth();
        $kelasId = $request->kelas_id;

        $kelasNama = $kelasId ? (Kelas::find($kelasId)->nama ?? '-') : 'Semua';

        $startDate = $bulan->copy()->startOfMonth();
        $endDate   = $bulan->copy()->endOfMonth();

        $dates = [];
        for($d=$startDate->copy(); $d->lte($endDate); $d->addDay()){
            $dates[] = $d->format('Y-m-d');
        }

        $query = Siswa::with(['kelas','absensi' => function($q) use ($startDate,$endDate){
            $q->whereBetween('tanggal',[$startDate->format('Y-m-d'),$endDate->format('Y-m-d')]);
        }])->when($kelasId, fn($q) => $q->where('kelas_id',$kelasId));

        $rekap = [];
        foreach($query->get() as $s){
            $row = [
                'nis'     => $s->nis,
                'nama'    => $s->nama,
                'kelas'   => $s->kelas->nama ?? '-',
                'absensi' => []
            ];
            foreach($dates as $tgl){
                $absen = $s->absensi->firstWhere('tanggal',$tgl);
                if(!$absen){
                    $row['absensi'][$tgl] = '-';
                }else{
                    if($absen->status == 'absen_masuk' && $absen->status_masuk == 'telat'){
                        $row['absensi'][$tgl] = 'telat';
                    }elseif($absen->status == 'absen_masuk'){
                        $row['absensi'][$tgl] = 'masuk';
                    }elseif($absen->status == 'sakit'){
                        $row['absensi'][$tgl] = 'sakit';
                    }elseif($absen->status == 'izin'){
                        $row['absensi'][$tgl] = 'izin';
                    }elseif($absen->status == 'alfa'){
                        $row['absensi'][$tgl] = 'alfa';
                    }else{
                        $row['absensi'][$tgl] = $absen->status;
                    }
                }
            }
            $rekap[] = $row;
        }

        $bulanStr = $bulan->format('Y-m');

        if($request->submit === 'excel'){
            return Excel::download(
                new DetailAbsensiSiswaExport($rekap,$kelasNama,$bulanStr,$dates),
                'detail_absensi_siswa_'.$kelasNama.'_'.$bulanStr.'.xlsx'
            );
        }

        $pdf = Pdf::loadView('website.report.detail_absensi_siswa_pdf',[
            'rekap'     => $rekap,
            'kelasNama' => $kelasNama,
            'bulan'     => $bulanStr,
            'dates'     => $dates
        ])->setPaper('A4','landscape');

        return $pdf->download('detail_absensi_siswa_'.$kelasNama.'_'.$bulanStr.'.pdf');
    }
}
