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
        Schema::create('lms_finance', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['income','expense']);
            $table->string('category');
            $table->float('amount');
            $table->date('date');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('lms_users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_finances');
    }
};
