<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsAssignment;
use App\Models\LmsFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LmsAssignmentController extends Controller
{
    public function index()
    {
        return response()->json(LmsAssignment::with(['class', 'creator', 'submissions'])->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:lms_classes,id',
            'title' => 'required|string',
            'deadline' => 'required|date',
            'created_by' => 'required|exists:lms_users,id',
        ]);

        $assignment = LmsAssignment::create($request->only(['class_id', 'title', 'description', 'deadline', 'created_by']));

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('assignments', 'public');
                $assignment->files()->create([
                    'type' => 'file',
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        if ($request->links) {
            foreach ($request->links as $link) {
                $assignment->files()->create([
                    'type' => 'link',
                    'path' => $link,
                    'name' => basename($link),
                ]);
            }
        }

        return response()->json($assignment->load('files'), 201);
    }

    public function show(LmsAssignment $assignment)
    {
        return response()->json($assignment->load(['class', 'creator', 'submissions', 'files']));
    }

    public function update(Request $request, LmsAssignment $assignment)
    {
        $request->validate([
            'class_id' => 'sometimes|exists:lms_classes,id',
            'title' => 'sometimes|string',
            'deadline' => 'sometimes|date',
            'created_by' => 'sometimes|exists:lms_users,id',
        ]);

        $assignment->update($request->only(['class_id', 'title', 'description', 'deadline', 'created_by']));

        return response()->json($assignment);
    }

    public function destroy(LmsAssignment $assignment)
    {
        $assignment->delete();
        return response()->json(null, 204);
    }

    /**
     * Download or serve assignment file
     */
    public function downloadFile(LmsAssignment $assignment, $fileId)
    {
        $file = LmsFile::where('fileable_id', $assignment->id)
            ->where('fileable_type', LmsAssignment::class)
            ->where('id', $fileId)
            ->firstOrFail();

        // If it's a link type, redirect to it
        if ($file->type === 'link') {
            return redirect($file->path);
        }

        // For actual files stored in storage
        if (!Storage::disk('public')->exists($file->path)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($file->path, $file->name ?? basename($file->path));
    }

    /**
     * View assignment file inline (for iframe viewing)
     */
    public function viewFile(LmsAssignment $assignment, $fileId)
    {
        $file = LmsFile::where('fileable_id', $assignment->id)
            ->where('fileable_type', LmsAssignment::class)
            ->where('id', $fileId)
            ->firstOrFail();

        // If it's a link type, redirect to it
        if ($file->type === 'link') {
            return redirect($file->path);
        }

        // For actual files stored in storage
        if (!Storage::disk('public')->exists($file->path)) {
            abort(404, 'File not found');
        }

        // Get the file path and mime type
        $filePath = Storage::disk('public')->path($file->path);
        $mimeType = $file->mime ?? Storage::disk('public')->mimeType($file->path);

        // Return file response with inline disposition (for viewing in browser)
        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . ($file->name ?? basename($file->path)) . '"',
        ]);
    }
}
