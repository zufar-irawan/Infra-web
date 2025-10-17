<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsClass;
use Illuminate\Http\Request;

class LmsClassController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 15) ?: 15;

        $classes = LmsClass::with([
            'students.user',
            'classStudents.student.user',
            'teachers.user',
            'classTeachers.teacher.user',
            'classTeachers.subject',
        ])
            ->orderBy('name')
            ->paginate($perPage);

        return response()->json($classes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:lms_classes,name',
            'description' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $payload = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'aktif',
        ];

        $class = LmsClass::create($payload);

        return response()->json(
            $class->load([
                'students.user',
                'classStudents.student.user',
                'teachers.user',
                'classTeachers.teacher.user',
                'classTeachers.subject',
            ]),
            201
        );
    }

    public function show(LmsClass $class)
    {
        return response()->json(
            $class->load([
                'students.user',
                'classStudents.student.user',
                'teachers.user',
                'classTeachers.teacher.user',
                'classTeachers.subject',
            ])
        );
    }

    public function update(Request $request, LmsClass $class)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|unique:lms_classes,name,' . $class->id,
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|in:aktif,nonaktif',
        ]);

        $class->update($validated);

        return response()->json(
            $class->load([
                'students.user',
                'classStudents.student.user',
                'teachers.user',
                'classTeachers.teacher.user',
                'classTeachers.subject',
            ])
        );
    }

    public function destroy(LmsClass $class)
    {
        $class->delete();
        return response()->json(null, 204);
    }
}
