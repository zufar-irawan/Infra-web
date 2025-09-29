<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        return response()->json(Blog::with('author')->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'cover_image' => 'nullable|image|max:2048',
            'content' => 'required|string',
        ]);

        $path = null;
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('blogs', 'public');
        }

        $blog = Blog::create([
            'title' => $validated['title'],
            'cover_image' => $path,
            'content' => $validated['content'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully',
            'data' => $blog
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Blog::with('author')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('blogs', 'public');
            $blog->update(['cover_image' => $path]);
        }

        $blog->update($request->only(['title', 'content']));

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully',
            'data' => $blog
        ]);
    }

    public function destroy($id)
    {
        Blog::destroy($id);
        return response()->json(['success' => true, 'message' => 'Blog deleted successfully']);
    }
}
