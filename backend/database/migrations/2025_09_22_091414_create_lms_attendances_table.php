<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('lms_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('lms_classes')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('lms_students')->onDelete('cascade');
            $table->date('date');
            $table->enum('attendance_status', [
                'tidak_absen_masuk',
                'tidak_absen_pulang',
                'absen_masuk',
                'absen_pulang'
            ])->default('tidak_absen_masuk');
            $table->time('time_in')->nullable();
            $table->time('time_out')->nullable();
            $table->enum('status', [
                'telat',
                'tepat_waktu',
                'sakit',
                'izin',
                'alfa'
            ])->default('telat');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_attendances');
    }
};