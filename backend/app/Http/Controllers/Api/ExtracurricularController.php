<?php 

// app/Http/Controllers/Api/ExtracurricularController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExtracurricularResource;
use App\Models\Extracurricular;
use Illuminate\Http\Request;

class ExtracurricularController extends Controller
{
    // === LIST UNTUK ADMIN ===
    public function index()
    {
        $data = Extracurricular::orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('created_at','asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'List ekstrakurikuler',
            'data' => ExtracurricularResource::collection($data),
        ]);
    }

    // === TAMBAH ===
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_id' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'img' => 'nullable|string|max:255',
            'ig' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $ekskul = Extracurricular::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil ditambahkan',
            'data' => new ExtracurricularResource($ekskul)
        ], 201);
    }

    // === DETAIL ===
    public function show(Extracurricular $ekskul)
    {
        return response()->json([
            'success' => true,
            'message' => 'Detail ekstrakurikuler',
            'data' => new ExtracurricularResource($ekskul)
        ]);
    }

    // === UPDATE ===
    public function update(Request $request, Extracurricular $ekskul)
    {
        $validated = $request->validate([
            'name_id' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'img' => 'nullable|string|max:255',
            'ig' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $ekskul->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil diperbarui',
            'data' => new ExtracurricularResource($ekskul)
        ]);
    }

    // === HAPUS ===
    public function destroy(Extracurricular $ekskul)
    {
        $ekskul->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ekstrakurikuler berhasil dihapus'
        ]);
    }

    // === LIST PUBLIK ===
    public function publicList()
    {
        $data = Extracurricular::where('is_active', true)
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('created_at','asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'List ekstrakurikuler aktif',
            'data' => ExtracurricularResource::collection($data)
        ]);
    }
}
