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
        Schema::create('lms_files', function (Blueprint $table) {
            $table->id();
            $table->morphs('fileable'); // polymorphic: module, assignment, submission
            $table->string('type')->comment('link | image | file');
            $table->string('path'); // bisa simpan URL/link, atau path file
            $table->string('name')->nullable(); // nama file
            $table->string('mime')->nullable(); // tipe mime
            $table->integer('size')->nullable(); // ukuran file
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lms_files');
    }
};
