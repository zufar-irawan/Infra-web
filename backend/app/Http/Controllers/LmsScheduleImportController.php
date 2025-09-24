<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsScheduleImport;
use Illuminate\Http\Request;

class LmsScheduleImportController extends Controller
{
    public function index()
    {
        return response()->json(LmsScheduleImport::with('importer')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'file_path' => 'required|string',
            'imported_by' => 'required|exists:lms_users,id',
            'status' => 'required|in:success,failed',
            'notes' => 'nullable|string',
        ]);

        $import = LmsScheduleImport::create($request->all());
        return response()->json($import, 201);
    }

    public function show(LmsScheduleImport $schedule_import)
    {
        return response()->json($schedule_import->load('importer'));
    }
}
