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
        Schema::create('lms_attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('lms_classes')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('lms_students')->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alpha'])->default('hadir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_attendances');
    }
};
