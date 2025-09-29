<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use Illuminate\Http\Request;

class PrestasiController extends Controller
{
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

        return response()->json([
            'success' => true,
            'data' => $prestasi
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'poster' => 'required|image|max:2048'
        ]);

        $path = $request->file('poster')->store('prestasi', 'public');

        $prestasi = Prestasi::create([
            'poster' => $path
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Prestasi created successfully',
            'data' => $prestasi
        ], 201);
    }

    public function show($id)
    {
        $prestasi = Prestasi::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $prestasi
        ]);
    }

    public function update(Request $request, $id)
    {
        $prestasi = Prestasi::findOrFail($id);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('prestasi', 'public');
            $prestasi->update(['poster' => $path]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Prestasi updated successfully',
            'data' => $prestasi
        ]);
    }

    public function destroy($id)
    {
        Prestasi::destroy($id);
        return response()->json([
            'success' => true,
            'message' => 'Prestasi deleted successfully'
        ]);
    }
}
