<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mitra;

class MitraSeeder extends Seeder
{
    public function run(): void
    {
        Mitra::create([
            'name' => 'Komatsu',
            'img_id' => '/storage/mitra/komatsu_id.webp',
            'img_en' => '/storage/mitra/komatsu_en.webp',
        ]);

        Mitra::create([
            'name' => 'Panasonic',
            'img_id' => '/storage/mitra/panasonic_id.webp',
            'img_en' => '/storage/mitra/panasonic_en.webp',
        ]);
    }
}
