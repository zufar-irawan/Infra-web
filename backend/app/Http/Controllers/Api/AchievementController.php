<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use App\Models\Achievement;

class AchievementController extends Controller
{
    // GET /api/achievements
    public function index()
    {
        $data = Achievement::latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'poster' => asset('storage/' . $item->poster),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'List prestasi',
            'data' => $data,
        ]);
    }

    // POST /api/achievements
    public function store(Request $request)
    {
        $request->validate([
            'poster' => 'required|image|mimes:webp|max:2048',
        ]);

        // Pastikan folder ada
        $path = public_path('storage/achievements');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        // Simpan file
        $filePath = $request->file('poster')->store('achievements', 'public');

        $achievement = Achievement::create([
            'poster' => $filePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Prestasi berhasil ditambahkan',
            'data' => [
                'id' => $achievement->id,
                'poster' => asset('storage/' . $achievement->poster),
            ],
        ], 201);
    }

    // POST /api/achievements/{id}
    public function update(Request $request, $id)
    {
        $achievement = Achievement::findOrFail($id);

        $request->validate([
            'poster' => 'nullable|image|mimes:webp|max:2048',
        ]);

        if ($request->hasFile('poster')) {
            // Hapus file lama
            if ($achievement->poster && File::exists(public_path('storage/' . $achievement->poster))) {
                File::delete(public_path('storage/' . $achievement->poster));
            }

            // Simpan baru
            $newPath = $request->file('poster')->store('achievements', 'public');
            $achievement->poster = $newPath;
        }

        $achievement->save();

        return response()->json([
            'success' => true,
            'message' => 'Prestasi berhasil diperbarui',
            'data' => [
                'id' => $achievement->id,
                'poster' => asset('storage/' . $achievement->poster),
            ],
        ]);
    }

    // DELETE /api/achievements/{id}
    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);

        if ($achievement->poster && File::exists(public_path('storage/' . $achievement->poster))) {
            File::delete(public_path('storage/' . $achievement->poster));
        }

        $achievement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Prestasi berhasil dihapus',
        ]);
    }
}
