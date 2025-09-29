<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsStudent as Student;
use Illuminate\Http\Request;

class LmsStudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['user', 'class'])->paginate(15);
        return response()->json($students);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:lms_users,id|unique:lms_students,user_id', // ✅ lms_users
            'nis' => 'required|string|unique:lms_students,nis',
            'class_id' => 'nullable|exists:lms_classes,id',
            'guardian_name' => 'nullable|string',
            'guardian_contact' => 'nullable|string',
            'enrollment_date' => 'required|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $student = Student::create($request->all());
        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load(['user', 'class']));
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'nis' => 'sometimes|unique:lms_students,nis,' . $student->id,
            'class_id' => 'nullable|exists:lms_classes,id',
        ]);

        $student->update($request->all());
        return response()->json($student);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}