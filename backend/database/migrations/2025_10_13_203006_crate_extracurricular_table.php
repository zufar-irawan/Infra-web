<?php 

// database/migrations/2025_10_13_000001_create_extracurriculars_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('extracurriculars', function (Blueprint $table) {
            $table->id();
            $table->string('name_id');
            $table->string('name_en');
            $table->string('img')->nullable();      // path gambar / svg
            $table->string('ig')->nullable();       // link instagram
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('extracurriculars');
    }
};
