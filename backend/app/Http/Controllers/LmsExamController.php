<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsExam;
use Illuminate\Http\Request;

class LmsExamController extends Controller
{
    public function index()
    {
        return response()->json(LmsExam::with(['subject','class','creator'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:lms_subjects,id',
            'class_id' => 'required|exists:lms_classes,id',
            'title' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'created_by' => 'required|exists:lms_users,id',
        ]);

        $exam = LmsExam::create($request->all());
        return response()->json($exam, 201);
    }
}
