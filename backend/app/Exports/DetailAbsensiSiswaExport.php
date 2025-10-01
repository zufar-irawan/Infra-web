<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class DetailAbsensiSiswaExport implements FromView
{
    protected $rekap, $kelasNama, $bulan, $dates;

    public function __construct($rekap, $kelasNama, $bulan, $dates)
    {
        $this->rekap = $rekap;
        $this->kelasNama = $kelasNama;
        $this->bulan = $bulan;
        $this->dates = $dates;
    }

    public function view(): View
    {
        return view('website.report.detail_absensi_siswa_excel', [
            'rekap' => $this->rekap,
            'kelasNama' => $this->kelasNama,
            'bulan' => $this->bulan,
            'dates' => $this->dates,
        ]);
    }
}