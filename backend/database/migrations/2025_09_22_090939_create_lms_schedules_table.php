<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lms_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('day');
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('room_id')->nullable()->constrained('lms_rooms')->nullOnDelete();
            $table->foreignId('created_by')->constrained('lms_users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lms_schedules');
    }
};
