<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('img_id');
            $table->string('img_en');
            $table->string('category');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
