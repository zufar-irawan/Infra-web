<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsTeacher;
use App\Models\LmsUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class LmsTeacherController extends Controller
{
    public function index()
    {
        $teachers = LmsTeacher::with('user')->paginate(15);
        return response()->json($teachers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:lms_users,id|unique:lms_teachers,user_id',
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
            'nip' => 'required|string|unique:lms_teachers,nip',
            'specialization' => 'nullable|string',
            'join_date' => 'required|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $teacher = DB::transaction(function () use ($validated) {
            $userId = $validated['user_id'] ?? null;

            if (!$userId) {
                $user = LmsUser::create([
                    'name' => $validated['user_name'],
                    'email' => $validated['user_email'],
                    'password' => Hash::make($validated['user_password']),
                    'role' => 'guru',
                    'phone' => $validated['user_phone'] ?? null,
                    'status' => $validated['user_status'] ?? 'aktif',
                ]);

                $userId = $user->id;
            }

            $teacherData = [
                'user_id' => $userId,
                'nip' => $validated['nip'],
                'specialization' => $validated['specialization'] ?? null,
                'join_date' => $validated['join_date'],
                'status' => $validated['status'],
            ];

            return LmsTeacher::create($teacherData)->load('user');
        });

        return response()->json($teacher, 201);
    }

    public function show(LmsTeacher $teacher)
    {
        return response()->json($teacher->load('user'));
    }

    public function update(Request $request, LmsTeacher $teacher)
    {
        $request->validate([
            'nip' => 'sometimes|unique:lms_teachers,nip,' . $teacher->id,
        ]);

        $teacher->update($request->all());
        return response()->json($teacher);
    }

    public function destroy(LmsTeacher $teacher)
    {
        $teacher->delete();
        return response()->json(null, 204);
    }
}
