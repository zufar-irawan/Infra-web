<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsSubject;
use Illuminate\Http\Request;

class LmsSubjectController extends Controller
{
    public function index()
    {
        return response()->json(LmsSubject::paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:lms_subjects,code',
            'name' => 'required|string',
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'weekly_hours' => 'required|integer',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $subject = LmsSubject::create($request->all());
        return response()->json($subject, 201);
    }

    public function show(LmsSubject $subject)
    {
        return response()->json($subject);
    }

    public function update(Request $request, LmsSubject $subject)
    {
        $request->validate([
            'code' => 'sometimes|string|unique:subjects,code,' . $subject->id,
        ]);

        $subject->update($request->all());
        return response()->json($subject);
    }

    public function destroy(LmsSubject $subject)
    {
        $subject->delete();
        return response()->json(null, 204);
    }
}
