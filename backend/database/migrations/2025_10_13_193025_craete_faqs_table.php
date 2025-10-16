<?php

// database/migrations/2025_10_13_000000_create_faqs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('q_id', 255);
            $table->text('a_id');
            $table->string('q_en', 255);
            $table->text('a_en');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->nullable(); // optional urutan
            $table->timestamps();
            $table->softDeletes();
            $table->index(['is_active', 'sort_order']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('faqs');
    }
};
