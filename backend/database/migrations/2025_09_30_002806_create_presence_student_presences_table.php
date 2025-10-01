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
        Schema::create('presence_student_presences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->softDeletes();
            $table->uuid('siswa_id');
            $table->date('tanggal');
            $table->enum('status', ['tidak_absen_masuk', 'tidak_absen_pulang', 'absen_masuk', 'absen_pulang']);
            $table->time('jam_masuk')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->enum('status_masuk', ['telat', 'tepat_waktu', 'sakit', 'izin', 'alfa']);
            $table->text('keterangan')->nullable();

            $table->foreign('siswa_id')->references('id')->on('presence_students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presence_student_presences');
    }
};
