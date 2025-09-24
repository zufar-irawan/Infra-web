<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsSchedule;
use Illuminate\Http\Request;

class LmsScheduleController extends Controller
{
    public function index()
    {
        return response()->json(
            LmsSchedule::with(['room','creator','infals'])->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'type' => 'required|in:admin,personal',
            'target_type' => 'required|in:class,student,teacher',
            'target_id' => 'required|integer',
            'room_id' => 'nullable|exists:lms_rooms,id',
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'created_by' => 'required|exists:lms_users,id',
            'is_practice_week' => 'boolean',
        ]);

        $schedule = LmsSchedule::create($request->all());
        return response()->json($schedule, 201);
    }

    public function show(LmsSchedule $schedule)
    {
        return response()->json($schedule->load(['room','creator','infals']));
    }

    public function update(Request $request, LmsSchedule $schedule)
    {
        $request->validate([
            'room_id' => 'nullable|exists:lms_rooms,id',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
        ]);

        $schedule->update($request->all());
        return response()->json($schedule);
    }

    public function destroy(LmsSchedule $schedule)
    {
        $schedule->delete();
        return response()->json(null, 204);
    }
}
