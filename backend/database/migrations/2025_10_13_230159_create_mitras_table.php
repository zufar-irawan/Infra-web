<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mitras', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('img_id'); // path logo Indonesia
            $table->string('img_en'); // path logo English
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mitras');
    }
};
