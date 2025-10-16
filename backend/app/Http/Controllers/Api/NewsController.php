<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class NewsController extends Controller
{
    // GET /api/news
    public function index()
    {
        $data = News::latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title_id' => $item->title_id,
                'title_en' => $item->title_en,
                'desc_id' => $item->desc_id,
                'desc_en' => $item->desc_en,
                'date' => $item->date,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'List berita',
            'data' => $data,
        ]);
    }

    // POST /api/news
    public function store(Request $request)
    {
        $request->validate([
            'title_id' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'desc_id' => 'required|string',
            'desc_en' => 'required|string',
            'date' => 'required|date',
            'image' => 'nullable|image|mimes:webp,jpg,jpeg,png|max:2048',
        ]);

        $path = public_path('storage/news');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
        }

        $news = News::create([
            'title_id' => $request->title_id,
            'title_en' => $request->title_en,
            'desc_id' => $request->desc_id,
            'desc_en' => $request->desc_en,
            'date' => $request->date,
            'image' => $imagePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil ditambahkan',
            'data' => $news,
        ], 201);
    }

    // GET /api/news/{id}
    public function show($id)
    {
        $item = News::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail berita',
            'data' => [
                'id' => $item->id,
                'title_id' => $item->title_id,
                'title_en' => $item->title_en,
                'desc_id' => $item->desc_id,
                'desc_en' => $item->desc_en,
                'date' => $item->date,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
            ],
        ]);
    }

    // POST /api/news/{id}
    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $request->validate([
            'title_id' => 'nullable|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'desc_id' => 'nullable|string',
            'desc_en' => 'nullable|string',
            'date' => 'nullable|date',
            'image' => 'nullable|image|mimes:webp,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($news->image && File::exists(public_path('storage/' . $news->image))) {
                File::delete(public_path('storage/' . $news->image));
            }
            $news->image = $request->file('image')->store('news', 'public');
        }

        $news->update($request->only(['title_id', 'title_en', 'desc_id', 'desc_en', 'date']));

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diperbarui',
            'data' => $news,
        ]);
    }

    // DELETE /api/news/{id}
    public function destroy($id)
    {
        $news = News::findOrFail($id);

        if ($news->image && File::exists(public_path('storage/' . $news->image))) {
            File::delete(public_path('storage/' . $news->image));
        }

        $news->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dihapus',
        ]);
    }
}
