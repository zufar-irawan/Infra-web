<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsStudent as Student;
use App\Models\LmsUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class LmsStudentController extends Controller
{
    public function index()
    {
        $students = Student::with(['user', 'class', 'rfid'])->get();
        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:lms_users,id|unique:lms_students,user_id',
            'user_name' => 'nullable|required_without:user_id|string|max:150',
            'user_email' => [
                'nullable',
                'required_without:user_id',
                'email',
                Rule::unique('lms_users', 'email'),
            ],
            'user_password' => 'nullable|required_without:user_id|string|min:6',
            'user_phone' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('lms_users', 'phone'),
            ],
            'user_status' => ['nullable', Rule::in(['aktif', 'nonaktif'])],
            'nis' => 'required|string|unique:lms_students,nis',
            'class_id' => 'nullable|exists:lms_classes,id',
            'guardian_name' => 'nullable|string',
            'guardian_contact' => 'nullable|string',
            'enrollment_date' => 'required|date',
            'rfid_id' => 'nullable|exists:lms_rfid,id|unique:lms_students,rfid_id',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $student = DB::transaction(function () use ($validated) {
            $userId = $validated['user_id'] ?? null;

            if (!$userId) {
                $user = LmsUser::create([
                    'name' => $validated['user_name'],
                    'email' => $validated['user_email'],
                    'password' => Hash::make($validated['user_password']),
                    'role' => 'siswa',
                    'phone' => $validated['user_phone'] ?? null,
                    'status' => $validated['user_status'] ?? 'aktif',
                ]);

                $userId = $user->id;
            }

            $studentData = [
                'user_id' => $userId,
                'nis' => $validated['nis'],
                'class_id' => $validated['class_id'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_contact' => $validated['guardian_contact'] ?? null,
                'enrollment_date' => $validated['enrollment_date'],
                'rfid_id' => $validated['rfid_id'] ?? null,
                'status' => $validated['status'],
            ];

            return Student::create($studentData)->load(['user', 'class', 'rfid']);
        });

        return response()->json($student, 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load(['user', 'class', 'rfid']));
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'nis' => 'sometimes|unique:lms_students,nis,' . $student->id,
            'class_id' => 'nullable|exists:lms_classes,id',
        ]);

        $student->update($request->all());
        return response()->json($student->load(['user', 'class', 'rfid']));
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return response()->json(null, 204);
    }
}