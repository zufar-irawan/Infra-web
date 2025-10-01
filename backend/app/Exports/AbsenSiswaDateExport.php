<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class AbsenSiswaDateExport implements FromView
{
    protected $presences, $date;

    public function __construct($presences, $date)
    {
        $this->presences = $presences;
        $this->date = $date;
    }

    public function view(): View
    {
        return view('website.report.report_date_excel', [
            'presences' => $this->presences,
            'date' => $this->date
        ]);
    }
}