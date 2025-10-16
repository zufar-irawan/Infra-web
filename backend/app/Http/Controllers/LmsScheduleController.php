<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsSchedule;
use Illuminate\Http\Request;

class LmsScheduleController extends Controller
{
    public function index()
    {
        return response()->json(LmsSchedule::with(['room', 'creator'])->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'day' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_id' => 'nullable|exists:lms_rooms,id',
            'created_by' => 'required|exists:lms_users,id',
        ]);

        $schedule = LmsSchedule::create($request->all());
        return response()->json($schedule, 201);
    }

    public function show(LmsSchedule $schedule)
    {
        return response()->json($schedule->load(['room', 'creator']));
    }

    public function update(Request $request, LmsSchedule $schedule)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'day' => 'sometimes|date_format:Y-m-d',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'room_id' => 'nullable|exists:lms_rooms,id',
        ]);

        $schedule->update($request->all());
        return response()->json($schedule);
    }

    public function destroy(LmsSchedule $schedule)
    {
        $schedule->delete();
        return response()->json(['message' => 'Schedule deleted'], 200);
    }
}
