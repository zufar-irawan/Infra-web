<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsClassTeacher;
use Illuminate\Http\Request;

class LmsClassTeacherController extends Controller
{
    public function index()
    {
        return response()->json(LmsClassTeacher::with(['class', 'teacher', 'subject'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:lms_classes,id',
            'teacher_id' => 'required|exists:lms_teachers,id',
            'subject_id' => 'required|exists:lms_subjects,id',
        ]);

        $record = LmsClassTeacher::create($request->all());
        return response()->json($record, 201);
    }

    public function show(LmsClassTeacher $class_teacher)
    {
        return response()->json($class_teacher->load(['class', 'teacher', 'subject']));
    }

    public function update(Request $request, LmsClassTeacher $class_teacher)
    {
        $request->validate([
            'class_id' => 'sometimes|exists:lms_classes,id',
            'teacher_id' => 'sometimes|exists:lms_teachers,id',
            'subject_id' => 'sometimes|exists:lms_subjects,id',
        ]);

        $class_teacher->update($request->all());
        return response()->json($class_teacher);
    }

    public function destroy(LmsClassTeacher $class_teacher)
    {
        $class_teacher->delete();
        return response()->json(null, 204);
    }
}
