<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mitra;
use Illuminate\Support\Facades\Storage;

class MitraController extends Controller
{
    // === Ambil semua mitra (admin) ===
    public function index()
    {
        $mitras = Mitra::orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'data' => $mitras]);
    }

    // === Tambah mitra ===
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'img_id' => 'required|file|max:5120', // ✅ file bebas, max 5MB
            'img_en' => 'required|file|max:5120',
        ]);

        // Simpan file ke storage/app/public/mitra
        $path_id = $request->file('img_id')->store('mitra', 'public');
        $path_en = $request->file('img_en')->store('mitra', 'public');

        $mitra = Mitra::create([
            'name'   => $validated['name'],
            'img_id' => '/storage/' . $path_id,
            'img_en' => '/storage/' . $path_en,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mitra berhasil ditambahkan.',
            'data'    => $mitra,
        ], 201);
    }

    // === Detail mitra ===
    public function show($id)
    {
        $mitra = Mitra::find($id);
        if (!$mitra) {
            return response()->json(['success' => false, 'message' => 'Mitra tidak ditemukan.'], 404);
        }
        return response()->json(['success' => true, 'data' => $mitra]);
    }

    // === Update mitra ===
    public function update(Request $request, $id)
    {
        $mitra = Mitra::find($id);
        if (!$mitra) {
            return response()->json(['success' => false, 'message' => 'Mitra tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'img_id' => 'nullable|file|max:5120',
            'img_en' => 'nullable|file|max:5120',
        ]);

        // hapus file lama kalau upload baru
        if ($request->hasFile('img_id')) {
            if ($mitra->img_id && file_exists(public_path($mitra->img_id))) {
                unlink(public_path($mitra->img_id));
            }
            $path_id = $request->file('img_id')->store('mitra', 'public');
            $mitra->img_id = '/storage/' . $path_id;
        }

        if ($request->hasFile('img_en')) {
            if ($mitra->img_en && file_exists(public_path($mitra->img_en))) {
                unlink(public_path($mitra->img_en));
            }
            $path_en = $request->file('img_en')->store('mitra', 'public');
            $mitra->img_en = '/storage/' . $path_en;
        }

        $mitra->name = $validated['name'];
        $mitra->save();

        return response()->json([
            'success' => true,
            'message' => 'Mitra berhasil diperbarui.',
            'data'    => $mitra,
        ]);
    }

    // === Hapus mitra ===
    public function destroy($id)
    {
        $mitra = Mitra::find($id);
        if (!$mitra) {
            return response()->json(['success' => false, 'message' => 'Mitra tidak ditemukan.'], 404);
        }

        if ($mitra->img_id && file_exists(public_path($mitra->img_id))) {
            unlink(public_path($mitra->img_id));
        }
        if ($mitra->img_en && file_exists(public_path($mitra->img_en))) {
            unlink(public_path($mitra->img_en));
        }

        $mitra->delete();

        return response()->json(['success' => true, 'message' => 'Mitra berhasil dihapus.']);
    }

    // === Public endpoint untuk FE ===
    public function publicList()
    {
        $mitras = Mitra::orderBy('id', 'desc')->get();
        return response()->json(['success' => true, 'data' => $mitras]);
    }
}
