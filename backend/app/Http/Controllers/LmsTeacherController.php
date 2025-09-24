<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsTeacher;
use Illuminate\Http\Request;

class LmsTeacherController extends Controller
{
    public function index()
    {
        $teachers = LmsTeacher::with('user')->paginate(15);
        return response()->json($teachers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:lms_users,id|unique:lms_teachers,user_id',
            'nip' => 'required|unique:lms_teachers,nip',
            'specialization' => 'nullable|string',
            'join_date' => 'required|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $teacher = LmsTeacher::create($request->all());
        return response()->json($teacher, 201);
    }

    public function show(LmsTeacher $teacher)
    {
        return response()->json($teacher->load('user'));
    }

    public function update(Request $request, LmsTeacher $teacher)
    {
        $request->validate([
            'nip' => 'sometimes|unique:teachers,nip,' . $teacher->id,
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
