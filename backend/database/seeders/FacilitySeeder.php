<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Facility;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        $path = public_path('storage/facilities');
        if (!File::exists($path)) {
            File::makeDirectory($path, 0777, true, true);
        }

        $samples = [
            [
                'img_id' => 'facilities/labRpl_id.webp',
                'img_en' => 'facilities/labRpl_en.webp',
                'category' => 'Laboratorium & Studio',
            ],
            [
                'img_id' => 'facilities/lapangan_id.webp',
                'img_en' => 'facilities/lapangan_en.webp',
                'category' => 'Fasilitas Olahraga',
            ],
        ];

        foreach ($samples as $sample) {
            Facility::create($sample);
        }

        $this->command->info('✅ FacilitySeeder berhasil dijalankan!');
    }
}
