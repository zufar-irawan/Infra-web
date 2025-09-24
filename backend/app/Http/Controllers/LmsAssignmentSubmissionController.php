<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsAssignmentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LmsAssignmentSubmissionController extends Controller
{
    public function index()
    {
        $submissions = LmsAssignmentSubmission::with(['assignment', 'student', 'files'])
            ->orderBy('id', 'desc')
            ->paginate(15);

        return response()->json($submissions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'assignment_id' => 'required|exists:lms_assignments,id',
            'student_id'    => 'required|exists:lms_students,id',
            'grade'         => 'nullable|numeric|min:0|max:100',
            'feedback'      => 'nullable|string',
            'submitted_at'  => 'nullable|date',
            'files.*'       => 'nullable|file|max:10240', // max 10 MB
            'links.*'       => 'nullable|url',
        ]);

        $submission = LmsAssignmentSubmission::create($request->only([
            'assignment_id', 'student_id', 'grade', 'feedback', 'submitted_at'
        ]));

        // upload file
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions', 'public');
                $submission->files()->create([
                    'type' => 'file',
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        // simpan link
        if ($request->links) {
            foreach ($request->links as $link) {
                $submission->files()->create([
                    'type' => 'link',
                    'path' => $link,
                    'name' => basename($link),
                ]);
            }
        }

        return response()->json($submission->load(['assignment','student','files']), 201);
    }

    public function show(LmsAssignmentSubmission $assignment_submission)
    {
        return response()->json(
            $assignment_submission->load(['assignment','student','files'])
        );
    }

    public function update(Request $request, LmsAssignmentSubmission $assignment_submission)
    {
        $request->validate([
            'grade'        => 'nullable|numeric|min:0|max:100',
            'feedback'     => 'nullable|string',
            'submitted_at' => 'nullable|date',
            'files.*'      => 'nullable|file|max:10240',
            'links.*'      => 'nullable|url',
        ]);

        $assignment_submission->update($request->only(['grade','feedback','submitted_at']));

        // replace files kalau ada upload baru
        if ($request->hasFile('files')) {
            // hapus file lama di storage
            foreach ($assignment_submission->files()->where('type','file')->get() as $oldFile) {
                Storage::disk('public')->delete($oldFile->path);
                $oldFile->delete();
            }

            // simpan file baru
            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions', 'public');
                $assignment_submission->files()->create([
                    'type' => 'file',
                    'path' => $path,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        }

        // replace links kalau ada
        if ($request->links) {
            $assignment_submission->files()->where('type','link')->delete();
            foreach ($request->links as $link) {
                $assignment_submission->files()->create([
                    'type' => 'link',
                    'path' => $link,
                    'name' => basename($link),
                ]);
            }
        }

        return response()->json($assignment_submission->load(['assignment','student','files']));
    }

    public function destroy(LmsAssignmentSubmission $assignment_submission)
    {
        // hapus file fisik
        foreach ($assignment_submission->files()->where('type','file')->get() as $file) {
            Storage::disk('public')->delete($file->path);
            $file->delete();
        }

        // hapus submission
        $assignment_submission->delete();

        return response()->json(['message' => 'Submission deleted successfully']);
    }
}
