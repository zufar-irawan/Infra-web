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
        Schema::create('lms_reports', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['akademik', 'siswa', 'guru', 'keuangan']);
            $table->json('content');
            $table->foreignId('created_by')->constrained('lms_users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_reports');
    }
};
