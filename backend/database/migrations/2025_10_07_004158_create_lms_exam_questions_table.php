<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lms_exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('lms_exams')->onDelete('cascade');
            $table->enum('type', ['pg', 'essay'])->default('pg'); // tipe soal
            $table->text('question_text'); // isi pertanyaan
            $table->integer('points')->default(1); // bobot nilai
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_exam_questions');
    }
};
