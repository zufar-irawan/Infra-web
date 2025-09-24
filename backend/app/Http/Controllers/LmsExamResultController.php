<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsExamResult;
use Illuminate\Http\Request;

class LmsExamResultController extends Controller
{
    public function index()
    {
        return response()->json(LmsExamResult::with(['exam','student'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:lms_exams,id',
            'student_id' => 'required|exists:lms_students,id',
            'score' => 'required|numeric|min:0|max:100',
            'grade' => 'nullable|string',
            'feedback' => 'nullable|string',
        ]);

        $result = LmsExamResult::create($request->all());
        return response()->json($result, 201);
    }
}
