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
        Schema::create('lms_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['admin','personal']);
            $table->enum('target_type', ['class','student','teacher']);
            $table->unsignedBigInteger('target_id');
            $table->foreignId('room_id')->nullable()->constrained('lms_rooms')->nullOnDelete();
            $table->string('day');
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('created_by')->constrained('lms_users')->onDelete('cascade');
            $table->boolean('is_practice_week')->default(false);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_schedules');
    }
};
