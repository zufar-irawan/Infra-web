<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsRoom;
use Illuminate\Http\Request;

class LmsRoomController extends Controller
{
    public function index()
    {
        return response()->json(LmsRoom::paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:lms_rooms,name',
            'capacity' => 'required|integer|min:0',
            'type' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $room = LmsRoom::create($request->all());
        return response()->json($room, 201);
    }

    public function show(LmsRoom $room)
    {
        return response()->json($room->load(['schedules','exams']));
    }

    public function update(Request $request, LmsRoom $room)
{
    $request->validate([
        'name' => 'sometimes|string|unique:lms_rooms,name,' . $room->id,
        'capacity' => 'sometimes|integer|min:0',
        'type' => 'sometimes|string|nullable',
        'status' => 'sometimes|in:aktif,nonaktif',
    ]);

    $data = $request->only(['name','capacity','type','status']);

    if (empty($data)) {
        return response()->json([
            'success' => false,
            'message' => 'No valid data provided for update'
        ], 422);
    }

    $room->update($data);

    return response()->json([
        'success' => true,
        'message' => 'Room updated successfully',
        'data' => $room
    ], 200); // ✅ update harusnya 200
}


    public function destroy(LmsRoom $room)
    {
        $room->delete();
        return response()->json(null, 204);
    }
}
