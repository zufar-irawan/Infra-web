<?php

namespace App\Exports;

use App\Invoice;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class PresenceStaffExport implements FromView
{
    protected $presences, $startDate, $endDate, $staff;

    public function __construct($presences, $startDate, $endDate, $staff)
    {
        $this->presences = $presences;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->staff = $staff;
    }

    public function view(): View
    {
        return view('website.report.report_staff_excel', [
            'presences' => $this->presences,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
            'staff' => $this->staff,
        ]);
    }
}