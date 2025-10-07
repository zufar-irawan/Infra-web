<?php

namespace App\Http\Controllers;

use App\Models\LmsExamQuestion;
use App\Models\LmsExamQuestionOption;
use Illuminate\Http\Request;

class LmsExamQuestionController extends Controller
{
    /**
     * Tampilkan semua soal beserta opsi
     */
    public function index()
    {
        return response()->json(
            LmsExamQuestion::with(['exam', 'options'])->paginate(15)
        );
    }

    /**
     * Tambah soal baru (PG atau Essay)
     */
    public function store(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:lms_exams,id',
            'type' => 'required|in:pg,essay',
            'question_text' => 'required|string',
            'points' => 'required|integer|min:1',
            'options' => 'array|required_if:type,pg',
            'options.*.option_text' => 'required_if:type,pg|string',
            'options.*.is_correct' => 'boolean',
        ]);

        // Buat soal
        $question = LmsExamQuestion::create($request->only([
            'exam_id', 'type', 'question_text', 'points'
        ]));

        // Jika PG, buat opsi jawaban
        if ($request->type === 'pg' && $request->has('options')) {
            foreach ($request->options as $opt) {
                LmsExamQuestionOption::create([
                    'question_id' => $question->id,
                    'option_text' => $opt['option_text'],
                    'is_correct' => $opt['is_correct'] ?? false,
                ]);
            }
        }

        return response()->json(
            $question->load('options'),
            201
        );
    }

    /**
     * Tampilkan detail soal tertentu
     */
    public function show($id)
    {
        $question = LmsExamQuestion::with('options')->findOrFail($id);
        return response()->json($question);
    }

    /**
     * Update soal
     */
    public function update(Request $request, $id)
    {
        $question = LmsExamQuestion::findOrFail($id);

        $request->validate([
            'type' => 'in:pg,essay',
            'question_text' => 'string',
            'points' => 'integer|min:1',
            'options' => 'array|required_if:type,pg',
            'options.*.option_text' => 'required_if:type,pg|string',
            'options.*.is_correct' => 'boolean',
        ]);

        $question->update($request->only(['type', 'question_text', 'points']));

        // Update opsi hanya untuk PG
        if ($question->type === 'pg' && $request->has('options')) {
            $question->options()->delete(); // hapus opsi lama
            foreach ($request->options as $opt) {
                LmsExamQuestionOption::create([
                    'question_id' => $question->id,
                    'option_text' => $opt['option_text'],
                    'is_correct' => $opt['is_correct'] ?? false,
                ]);
            }
        }

        return response()->json($question->load('options'));
    }

    /**
     * Hapus soal
     */
    public function destroy($id)
    {
        $question = LmsExamQuestion::findOrFail($id);
        $question->delete();

        return response()->json(['message' => 'Soal berhasil dihapus']);
    }
}
