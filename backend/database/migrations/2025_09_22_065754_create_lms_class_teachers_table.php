<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lms_class_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('lms_classes')->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained('lms_teachers')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('lms_subjects')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['class_id', 'teacher_id', 'subject_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('lms_class_teachers');
    }
};
