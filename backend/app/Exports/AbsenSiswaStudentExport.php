<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AbsenSiswaStudentExport implements FromView
{
    protected $presences, $siswa, $startDate, $endDate;

    public function __construct($presences, $siswa, $startDate, $endDate)
    {
        $this->presences = $presences;
        $this->siswa = $siswa;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function view(): View
    {
        return view('website.report.report_student_excel', [
            'presences' => $this->presences,
            'siswa' => $this->siswa,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate
        ]);
    }
}