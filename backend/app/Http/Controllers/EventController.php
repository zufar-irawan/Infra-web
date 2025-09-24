<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Event::paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'id_video' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        $path = null;
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('events', 'public');
        }

        $event = Event::create([
            'title' => $validated['title'],
            'id_video' => $validated['id_video'],
            'thumbnail' => $path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Event::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('events', 'public');
            $event->update(['thumbnail' => $path]);
        }

        $event->update($request->only(['title', 'id_video']));

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event
        ]);
    }

    public function destroy($id)
    {
        Event::destroy($id);
        return response()->json(['success' => true, 'message' => 'Event deleted successfully']);
    }
}
