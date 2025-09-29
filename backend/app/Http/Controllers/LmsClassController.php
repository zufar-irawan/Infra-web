<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsClass;
use Illuminate\Http\Request;

class LmsClassController extends Controller
{
    public function index()
    {
        $classes = LmsClass::with(['students', 'teachers'])->paginate(15);
        return response()->json($classes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:lms_classes,name',
            'description' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $class = LmsClass::create($request->all());
        return response()->json($class, 201);
    }

    public function show(LmsClass $class)
    {
        return response()->json($class->load(['students', 'teachers']));
    }

    public function update(Request $request, LmsClass $class)
    {
        $request->validate([
            'name' => 'sometimes|unique:lms_classes,name,' . $class->id,
        ]);

        $class->update($request->all());
        return response()->json($class);
    }

    public function destroy(LmsClass $class)
    {
        $class->delete();
        return response()->json(null, 204);
    }
}
