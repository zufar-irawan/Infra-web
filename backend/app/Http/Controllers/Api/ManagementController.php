<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Management;
use Illuminate\Support\Facades\File;

class ManagementController extends Controller
{
    // GET /api/management
    public function index()
    {
        $data = Management::all()->map(function ($item) {
            return [
                'id' => $item->id,
                'img_id' => asset('storage/' . $item->img_id),
                'img_en' => asset('storage/' . $item->img_en),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'List management data',
            'data' => $data
        ]);
    }

    // POST /api/management
    public function store(Request $request)
    {
        $request->validate([
            'img_id' => 'required|image|mimes:webp|max:2048',
            'img_en' => 'required|image|mimes:webp|max:2048',
        ]);

        // pastikan folder ada
        $path = public_path('storage/management');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        // simpan file
        $imgIdPath = $request->file('img_id')->store('management', 'public');
        $imgEnPath = $request->file('img_en')->store('management', 'public');

        $data = Management::create([
            'img_id' => $imgIdPath,
            'img_en' => $imgEnPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil ditambahkan',
            'data' => $data
        ]);
    }

    // PUT /api/management/{id}
    public function update(Request $request, $id)
    {
        $management = Management::findOrFail($id);

        if ($request->hasFile('img_id')) {
            File::delete(public_path('storage/' . $management->img_id));
            $management->img_id = $request->file('img_id')->store('management', 'public');
        }

        if ($request->hasFile('img_en')) {
            File::delete(public_path('storage/' . $management->img_en));
            $management->img_en = $request->file('img_en')->store('management', 'public');
        }

        $management->save();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diperbarui',
            'data' => $management
        ]);
    }

    // DELETE /api/management/{id}
    public function destroy($id)
    {
        $management = Management::findOrFail($id);

        File::delete(public_path('storage/' . $management->img_id));
        File::delete(public_path('storage/' . $management->img_en));

        $management->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus'
        ]);
    }

    // GET /api/management/public (untuk frontend publik)
    public function public()
    {
        $data = Management::all()->map(function ($item) {
            return [
                'id' => $item->id,
                'img_id' => asset('storage/' . $item->img_id),
                'img_en' => asset('storage/' . $item->img_en),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Public management list',
            'data' => $data
        ]);
    }
}
