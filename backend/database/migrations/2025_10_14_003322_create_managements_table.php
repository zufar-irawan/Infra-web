<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('managements', function (Blueprint $table) {
            $table->id();
            $table->string('img_id');
            $table->string('img_en');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('managements');
    }
};
