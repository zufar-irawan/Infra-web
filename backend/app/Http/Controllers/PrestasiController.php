<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class PrestasiController extends Controller
{
    /**
     * Tampilkan semua data prestasi (admin panel)
     */
    public function index(Request $request)
    {
        $query = Prestasi::query();

        // Filtering
        if ($request->has('poster')) {
            $query->where('poster', 'like', '%' . $request->poster . '%');
        }

        // Sorting
        if ($request->has('sort')) {
            $query->orderBy($request->get('sort'), $request->get('direction', 'asc'));
        }

        $prestasi = $query->paginate(10);

        // Format URL gambar ke path publik
        $prestasi->getCollection()->transform(function ($item) {
            $item->poster = asset('storage/' . $item->poster);
            return $item;
        });

        return response()->json([
            'success' => true,
            'data' => $prestasi
        ]);
    }

    /**
     * Simpan prestasi baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'poster' => 'required|image|mimes:webp,jpeg,png,jpg|max:2048'
        ]);

        // Pastikan folder tersedia
        $path = public_path('storage/prestasi');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        // Simpan file ke storage/public/prestasi
        $posterPath = $request->file('poster')->store('prestasi', 'public');

        $prestasi = Prestasi::create([
            'poster' => $posterPath
        ]);

        $prestasi->poster = asset('storage/' . $posterPath);

        return response()->json([
            'success' => true,
            'message' => 'Prestasi created successfully',
            'data' => $prestasi
        ], 201);
    }

    /**
     * Tampilkan detail prestasi
     */
    public function show($id)
    {
        $prestasi = Prestasi::findOrFail($id);
        $prestasi->poster = asset('storage/' . $prestasi->poster);

        return response()->json([
            'success' => true,
            'data' => $prestasi
        ]);
    }

    /**
     * Update prestasi
     */
    public function update(Request $request, $id)
    {
        $prestasi = Prestasi::findOrFail($id);

        if ($request->hasFile('poster')) {
            // Hapus file lama
            if (File::exists(public_path('storage/' . $prestasi->poster))) {
                File::delete(public_path('storage/' . $prestasi->poster));
            }

            // Simpan file baru
            $posterPath = $request->file('poster')->store('prestasi', 'public');
            $prestasi->update(['poster' => $posterPath]);
        }

        $prestasi->poster = asset('storage/' . $prestasi->poster);

        return response()->json([
            'success' => true,
            'message' => 'Prestasi updated successfully',
            'data' => $prestasi
        ]);
    }

    /**
     * Hapus prestasi
     */
    public function destroy($id)
    {
        $prestasi = Prestasi::findOrFail($id);

        // Hapus file dari storage
        if (File::exists(public_path('storage/' . $prestasi->poster))) {
            File::delete(public_path('storage/' . $prestasi->poster));
        }

        $prestasi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Prestasi deleted successfully'
        ]);
    }

    /**
     * Endpoint publik untuk frontend (tanpa auth)
     */
    public function public()
    {
        $prestasi = Prestasi::all()->map(function ($item) {
            return [
                'id' => $item->id,
                'poster' => asset('storage/' . $item->poster),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Daftar prestasi publik',
            'data' => $prestasi
        ]);
    }
}
