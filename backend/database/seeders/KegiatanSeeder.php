<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kegiatan;

class KegiatanSeeder extends Seeder
{
    public function run(): void
    {
        Kegiatan::create([
            'title_id' => 'EXPONER 2025',
            'title_en' => 'EXPONER 2025',
            'desc_id' => 'Pameran karya inovatif dan kreatifitas siswa SMK Prestasi Prima.',
            'desc_en' => 'An exhibition of innovation and creativity by Prestasi Prima students.',
            'date' => '2025-10-02',
            'time' => '23:00',
            'place' => 'Lapangan SMK Prestasi Prima',
        ]);

        Kegiatan::create([
            'title_id' => 'Saintek Fair 2025',
            'title_en' => 'Saintek Fair 2025',
            'desc_id' => 'Ajang tahunan untuk memperkenalkan teknologi dan sains kepada siswa.',
            'desc_en' => 'An annual event to introduce science and technology to students.',
            'date' => '2025-10-03',
            'time' => '23:00',
            'place' => 'Lapangan SMK Prestasi Prima',
        ]);
    }
}
