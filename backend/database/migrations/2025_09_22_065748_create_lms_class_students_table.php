<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lms_class_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('lms_classes')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('lms_students')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['class_id', 'student_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('lms_class_students');
    }
};
