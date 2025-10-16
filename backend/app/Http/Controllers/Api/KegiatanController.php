<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kegiatan;

class KegiatanController extends Controller
{
    // === Ambil semua kegiatan (admin) ===
    public function index()
    {
        $kegiatans = Kegiatan::orderBy('date', 'asc')->get();
        return response()->json([
            'success' => true,
            'data' => $kegiatans
        ]);
    }

    // === Tambah kegiatan ===
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_id' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'desc_id'  => 'required|string',
            'desc_en'  => 'required|string',
            'date'     => 'required|date',
            'time'     => 'required|date_format:H:i',
            'place'    => 'required|string|max:255',
        ]);

        $kegiatan = Kegiatan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil ditambahkan.',
            'data' => $kegiatan
        ], 201);
    }

    // === Detail kegiatan ===
    public function show($id)
    {
        $kegiatan = Kegiatan::find($id);
        if (!$kegiatan) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan.'], 404);
        }
        return response()->json(['success' => true, 'data' => $kegiatan]);
    }

    // === Update kegiatan ===
    public function update(Request $request, $id)
    {
        $kegiatan = Kegiatan::find($id);
        if (!$kegiatan) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'title_id' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'desc_id'  => 'required|string',
            'desc_en'  => 'required|string',
            'date'     => 'required|date',
            'time'     => 'required|date_format:H:i',
            'place'    => 'required|string|max:255',
        ]);

        $kegiatan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil diperbarui.',
            'data' => $kegiatan
        ]);
    }

    // === Hapus kegiatan ===
    public function destroy($id)
    {
        $kegiatan = Kegiatan::find($id);
        if (!$kegiatan) {
            return response()->json(['success' => false, 'message' => 'Kegiatan tidak ditemukan.'], 404);
        }

        $kegiatan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil dihapus.'
        ]);
    }

    // === Untuk halaman publik ===
    public function publicList()
    {
        $kegiatans = Kegiatan::orderBy('date', 'asc')->get();
        return response()->json(['success' => true, 'data' => $kegiatans]);
    }
}
