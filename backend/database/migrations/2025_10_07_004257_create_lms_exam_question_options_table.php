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
        Schema::create('lms_exam_question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('lms_exam_questions')->onDelete('cascade');
            $table->string('option_text');        // isi pilihan jawaban
            $table->boolean('is_correct')->default(false); // penanda jawaban benar
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_exam_question_options');
    }
};
