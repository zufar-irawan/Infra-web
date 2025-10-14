<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Models\Facility;

class FacilityController extends Controller
{
    // GET /api/facilities
    public function index()
    {
        $data = Facility::all()->map(function ($item) {
            return [
                'id' => $item->id,
                'img_id' => asset('storage/' . $item->img_id),
                'img_en' => asset('storage/' . $item->img_en),
                'category' => $item->category,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'List fasilitas',
            'data' => $data
        ]);
    }

    // POST /api/facilities
    public function store(Request $request)
    {
        $request->validate([
            'img_id' => 'required|image|mimes:webp|max:2048',
            'img_en' => 'required|image|mimes:webp|max:2048',
            'category' => 'required|string|max:255'
        ]);

        $path = public_path('storage/facilities');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        $imgIdPath = $request->file('img_id')->store('facilities', 'public');
        $imgEnPath = $request->file('img_en')->store('facilities', 'public');

        $facility = Facility::create([
            'img_id' => $imgIdPath,
            'img_en' => $imgEnPath,
            'category' => $request->category
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas berhasil ditambahkan',
            'data' => $facility
        ]);
    }

    // POST /api/facilities/{id} (update)
    public function update(Request $request, $id)
    {
        $facility = Facility::findOrFail($id);

        if ($request->hasFile('img_id')) {
            File::delete(public_path('storage/' . $facility->img_id));
            $facility->img_id = $request->file('img_id')->store('facilities', 'public');
        }

        if ($request->hasFile('img_en')) {
            File::delete(public_path('storage/' . $facility->img_en));
            $facility->img_en = $request->file('img_en')->store('facilities', 'public');
        }

        if ($request->category) {
            $facility->category = $request->category;
        }

        $facility->save();

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas berhasil diperbarui',
            'data' => $facility
        ]);
    }

    // DELETE /api/facilities/{id}
    public function destroy($id)
    {
        $facility = Facility::findOrFail($id);

        File::delete(public_path('storage/' . $facility->img_id));
        File::delete(public_path('storage/' . $facility->img_en));

        $facility->delete();

        return response()->json([
            'success' => true,
            'message' => 'Fasilitas berhasil dihapus'
        ]);
    }

    // GET /api/facilities/public
    public function public()
    {
        $data = Facility::all()->map(function ($item) {
            return [
                'id' => $item->id,
                'img_id' => asset('storage/' . $item->img_id),
                'img_en' => asset('storage/' . $item->img_en),
                'category' => $item->category,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Daftar fasilitas publik',
            'data' => $data
        ]);
    }
}
