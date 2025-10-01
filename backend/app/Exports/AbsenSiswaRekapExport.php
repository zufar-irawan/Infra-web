<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AbsenSiswaRekapExport implements FromView
{
    protected $rekap, $kelasNama, $subkelasNama, $startDate, $endDate;

    public function __construct($rekap, $kelasNama, $subkelasNama, $startDate, $endDate)
    {
        $this->rekap = $rekap;
        $this->kelasNama = $kelasNama;
        $this->subkelasNama = $subkelasNama;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function view(): View
    {
        return view('website.report.rekap_absensi_siswa_excel', [
            'rekap' => $this->rekap,
            'kelasNama' => $this->kelasNama,
            'subkelasNama' => $this->subkelasNama,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
        ]);
    }
}