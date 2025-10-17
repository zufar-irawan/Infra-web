<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsExam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LmsExamController extends Controller
{
    public function index()
    {
        return response()->json(
            LmsExam::with(['subject', 'class', 'creator'])->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // ✅ Hanya admin & teacher boleh buat ujian
        if (!in_array($user->role, ['admin', 'guru'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'subject_id' => 'required|exists:lms_subjects,id',
            'class_id' => 'required|exists:lms_classes,id',
            'title' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $exam = LmsExam::create([
            'subject_id' => $request->subject_id,
            'class_id' => $request->class_id,
            'title' => $request->title,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'created_by' => $user->id, // ✅ ambil dari user login
        ]);

        return response()->json($exam, 201);
    }

    public function show($id)
    {
        $exam = LmsExam::with(['subject', 'class', 'creator'])->findOrFail($id);
        return response()->json($exam);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $exam = LmsExam::findOrFail($id);

        // ✅ Hanya creator atau admin yang boleh update
        if ($exam->created_by !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'subject_id' => 'sometimes|required|exists:lms_subjects,id',
            'class_id' => 'sometimes|required|exists:lms_classes,id',
            'title' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
        ]);

        $exam->update($request->only([
            'subject_id',
            'class_id',
            'title',
            'date',
            'start_time',
            'end_time',
        ]));

        return response()->json($exam);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $exam = LmsExam::findOrFail($id);

        // ✅ Hanya creator atau admin yang boleh delete
        if ($exam->created_by !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $exam->delete();
        return response()->json(null, 204);
    }
}
