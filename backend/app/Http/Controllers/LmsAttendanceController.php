<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsAttendance;
use Illuminate\Http\Request;

class LmsAttendanceController extends Controller
{
    public function index()
    {
        return response()->json(LmsAttendance::with(['class','student'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:lms_classes,id',
            'student_id' => 'required|exists:lms_students,id',
            'date' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha',
        ]);

        $attendance = LmsAttendance::create($request->all());
        return response()->json($attendance, 201);
    }
}
