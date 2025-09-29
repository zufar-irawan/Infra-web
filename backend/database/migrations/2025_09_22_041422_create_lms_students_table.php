<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lms_students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('lms_users')->onDelete('cascade');
            $table->string('nis')->unique();
            $table->foreignId('class_id')->nullable()->constrained('lms_classes')->nullOnDelete();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_contact')->nullable();
            $table->date('enrollment_date');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('lms_students');
    }
};
