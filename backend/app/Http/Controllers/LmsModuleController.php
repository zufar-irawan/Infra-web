<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsModule;
use Illuminate\Http\Request;

class LmsModuleController extends Controller
{
    public function index()
    {
        return response()->json(LmsModule::with('subject', 'files')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:lms_subjects,id',
            'title' => 'required|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $module = LmsModule::create($request->only(['subject_id', 'title', 'description', 'status']));

        // upload file
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('modules', 'public');
                $module->files()->create([
                    'type' => 'file',
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        // link
        if ($request->links) {
            foreach ($request->links as $link) {
                $module->files()->create([
                    'type' => 'link',
                    'path' => $link,
                    'name' => basename($link),
                ]);
            }
        }

        return response()->json($module->load('files'), 201);
    }

    public function show(LmsModule $module)
    {
        return response()->json($module->load('subject', 'files'));
    }

    public function update(Request $request, LmsModule $module)
    {
        $request->validate([
            'subject_id' => 'sometimes|exists:lms_subjects,id',
        ]);

        $module->update($request->all());
        return response()->json($module);
    }

    public function destroy(LmsModule $module)
    {
        $module->delete();
        return response()->json(null, 204);
    }
}
