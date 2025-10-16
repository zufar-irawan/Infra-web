<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatans', function (Blueprint $table) {
            $table->id();
            $table->string('title_id');
            $table->string('title_en');
            $table->text('desc_id');
            $table->text('desc_en');
            $table->date('date');     // tanggal acara
            $table->time('time');     // jam acara
            $table->string('place');  // lokasi acara
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatans');
    }
};
