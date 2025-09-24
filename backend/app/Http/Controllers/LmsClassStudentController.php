<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsClassStudent;
use Illuminate\Http\Request;

class LmsClassStudentController extends Controller
{
    public function index()
    {
        return response()->json(LmsClassStudent::with(['class', 'student'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:lms_classes,id',
            'student_id' => 'required|exists:lms_students,id',
        ]);

        $record = LmsClassStudent::create($request->all());
        return response()->json($record, 201);
    }

    public function destroy(LmsClassStudent $lms_class_student)
    {
        $lms_class_student->delete();
        return response()->json(null, 204);
    }
}
