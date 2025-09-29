<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsInfal;
use Illuminate\Http\Request;

class LmsInfalController extends Controller
{
    public function index()
    {
        return response()->json(LmsInfal::with(['schedule','originalTeacher','replacementTeacher','assigner'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:lms_schedules,id',
            'teacher_original_id' => 'required|exists:lms_teachers,id',
            'teacher_replacement_id' => 'required|exists:lms_teachers,id|different:teacher_original_id',
            'reason' => 'nullable|string',
            'assigned_by' => 'required|exists:lms_users,id',
        ]);

        $infal = LmsInfal::create($request->all());
        return response()->json($infal, 201);
    }

    public function update(Request $request, LmsInfal $infal)
    {
        $data = $request->validate([
            'schedule_id' => 'sometimes|exists:lms_schedules,id',
            'teacher_original_id' => 'sometimes|exists:lms_teachers,id',
            'teacher_replacement_id' => 'sometimes|exists:lms_teachers,id|different:teacher_original_id',
            'reason' => 'nullable|string',
            'assigned_by' => 'sometimes|exists:lms_users,id',
        ]);

        $infal->update($data);
        return response()->json($infal);
    }

    public function destroy(LmsInfal $infal)
    {
        $infal->delete();
        return response()->json(null, 204);
    }
}
