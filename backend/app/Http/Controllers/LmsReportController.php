<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsReport;
use Illuminate\Http\Request;

class LmsReportController extends Controller
{
    public function index()
    {
        return response()->json(LmsReport::with('creator')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:akademik,siswa,guru,keuangan',
            'content' => 'required|array',
            'created_by' => 'required|exists:lms_users,id',
        ]);

        $report = LmsReport::create($request->all());
        return response()->json($report, 201);
    }
}
