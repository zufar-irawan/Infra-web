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
        Schema::create('lms_schedule_imports', function (Blueprint $table) {
            $table->id();
            $table->string('file_path');
            $table->foreignId('imported_by')->constrained('lms_users')->onDelete('cascade');
            $table->timestamp('imported_at')->useCurrent();
            $table->enum('status', ['success','failed']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_schedules_imports');
    }
};
