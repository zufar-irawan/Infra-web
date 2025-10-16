<?php 

// app/Http/Controllers/Api/FaqController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FaqController extends Controller
{
    /**
     * GET /api/faqs
     * Query:
     *  - active=1 -> hanya yang aktif (default: null = semua)
     *  - per_page=15 -> pagination size
     *  - lang=id|en -> optional untuk client-side filter (server tetap kirim lengkap)
     */
    public function index(Request $request)
    {
        $query = Faq::query();

        if ($request->boolean('active')) {
            $query->where('is_active', true);
        }

        // urutkan jika ada sort_order, lalu by created_at
        $query->orderByRaw('sort_order IS NULL, sort_order ASC')->orderBy('created_at', 'asc');

        $perPage = (int)($request->get('per_page', 15));
        $data = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'List of FAQs',
            'data'    => FaqResource::collection($data),
            'meta'    => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ]
        ]);
    }

    /**
     * POST /api/faqs
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'q_id'       => ['required','string','max:255'],
            'a_id'       => ['required','string'],
            'q_en'       => ['required','string','max:255'],
            'a_en'       => ['required','string'],
            'is_active'  => ['sometimes','boolean'],
            'sort_order' => ['nullable','integer','min:0'],
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created',
            'data'    => new FaqResource($faq),
        ], 201);
    }

    /**
     * GET /api/faqs/{id}
     */
    public function show(Faq $faq)
    {
        return response()->json([
            'success' => true,
            'message' => 'FAQ detail',
            'data'    => new FaqResource($faq),
        ]);
    }

    /**
     * PUT/PATCH /api/faqs/{id}
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'q_id'       => ['sometimes','required','string','max:255'],
            'a_id'       => ['sometimes','required','string'],
            'q_en'       => ['sometimes','required','string','max:255'],
            'a_en'       => ['sometimes','required','string'],
            'is_active'  => ['sometimes','boolean'],
            'sort_order' => ['nullable','integer','min:0'],
        ]);

        $faq->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated',
            'data'    => new FaqResource($faq),
        ]);
    }

    /**
     * DELETE /api/faqs/{id}
     */
    public function destroy(Faq $faq)
    {
        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted',
        ]);
    }

    /**
     * Endpoint publik (read only) yang hanya mengembalikan aktif
     * GET /api/public/faqs
     */
    public function publicList(Request $request)
    {
        $faqs = Faq::where('is_active', true)
            ->orderByRaw('sort_order IS NULL, sort_order ASC')
            ->orderBy('created_at','asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Public FAQ list',
            'data'    => FaqResource::collection($faqs),
        ]);
    }
}
