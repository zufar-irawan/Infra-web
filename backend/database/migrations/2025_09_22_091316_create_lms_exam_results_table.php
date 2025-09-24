<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lms_exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('lms_exams')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('lms_students')->onDelete('cascade');
            $table->float('score')->nullable();
            $table->string('grade')->nullable();
            $table->string('feedback')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_exam_results');
    }
};
