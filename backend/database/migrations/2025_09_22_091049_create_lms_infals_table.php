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
        Schema::create('lms_infals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('lms_schedules')->onDelete('cascade');
            $table->foreignId('teacher_original_id')->constrained('lms_teachers')->onDelete('cascade');
            $table->foreignId('teacher_replacement_id')->constrained('lms_teachers')->onDelete('cascade');
            $table->string('reason')->nullable();
            $table->foreignId('assigned_by')->constrained('lms_users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_infals');
    }
};
