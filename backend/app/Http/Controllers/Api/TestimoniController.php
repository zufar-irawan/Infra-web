<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimoni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class TestimoniController extends Controller
{
    // GET /api/testimoni
    public function index()
    {
        $data = Testimoni::latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'major_id' => $item->major_id,
                'major_en' => $item->major_en,
                'message_id' => $item->message_id,
                'message_en' => $item->message_en,
                'photo_id' => $item->photo_id ? asset('storage/' . $item->photo_id) : null,
                'photo_en' => $item->photo_en ? asset('storage/' . $item->photo_en) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'List testimoni',
            'data' => $data
        ]);
    }

    // POST /api/testimoni
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'major_id' => 'required|string|max:255',
            'major_en' => 'required|string|max:255',
            'message_id' => 'required|string',
            'message_en' => 'required|string',
            'photo_id' => 'nullable|image|mimes:webp|max:2048',
            'photo_en' => 'nullable|image|mimes:webp|max:2048',
        ]);

        $path = public_path('storage/testimoni');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        $photoId = $request->hasFile('photo_id')
            ? $request->file('photo_id')->store('testimoni', 'public')
            : null;
        $photoEn = $request->hasFile('photo_en')
            ? $request->file('photo_en')->store('testimoni', 'public')
            : null;

        $testimoni = Testimoni::create([
            'name' => $request->name,
            'major_id' => $request->major_id,
            'major_en' => $request->major_en,
            'message_id' => $request->message_id,
            'message_en' => $request->message_en,
            'photo_id' => $photoId,
            'photo_en' => $photoEn,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil ditambahkan',
            'data' => $testimoni
        ], 201);
    }

    // POST /api/testimoni/{id}
    public function update(Request $request, $id)
    {
        $testimoni = Testimoni::findOrFail($id);

        $request->validate([
            'name' => 'nullable|string|max:255',
            'major_id' => 'nullable|string|max:255',
            'major_en' => 'nullable|string|max:255',
            'message_id' => 'nullable|string',
            'message_en' => 'nullable|string',
            'photo_id' => 'nullable|image|mimes:webp|max:2048',
            'photo_en' => 'nullable|image|mimes:webp|max:2048',
        ]);

        if ($request->hasFile('photo_id')) {
            if ($testimoni->photo_id && File::exists(public_path('storage/' . $testimoni->photo_id))) {
                File::delete(public_path('storage/' . $testimoni->photo_id));
            }
            $testimoni->photo_id = $request->file('photo_id')->store('testimoni', 'public');
        }

        if ($request->hasFile('photo_en')) {
            if ($testimoni->photo_en && File::exists(public_path('storage/' . $testimoni->photo_en))) {
                File::delete(public_path('storage/' . $testimoni->photo_en));
            }
            $testimoni->photo_en = $request->file('photo_en')->store('testimoni', 'public');
        }

        $testimoni->update($request->only(['name', 'major_id', 'major_en', 'message_id', 'message_en']));

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil diperbarui',
            'data' => $testimoni
        ]);
    }

    // DELETE /api/testimoni/{id}
    public function destroy($id)
    {
        $testimoni = Testimoni::findOrFail($id);

        if ($testimoni->photo_id && File::exists(public_path('storage/' . $testimoni->photo_id))) {
            File::delete(public_path('storage/' . $testimoni->photo_id));
        }

        if ($testimoni->photo_en && File::exists(public_path('storage/' . $testimoni->photo_en))) {
            File::delete(public_path('storage/' . $testimoni->photo_en));
        }

        $testimoni->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil dihapus'
        ]);
    }
}
