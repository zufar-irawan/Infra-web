<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;
use Illuminate\Support\Facades\Storage;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan folder public/achievements sudah ada
        Storage::disk('public')->makeDirectory('achievements');

        // Contoh file dummy (kamu bisa ganti nanti)
        // misal kamu sudah punya file di public/sample/
        $sampleImages = [
            public_path('sample/ach1.webp'),
            public_path('sample/ach2.webp'),
            public_path('sample/ach3.webp'),
        ];

        foreach ($sampleImages as $index => $sample) {
            if (file_exists($sample)) {
                // Copy ke storage/public/achievements/
                $fileName = 'achievement_' . ($index + 1) . '.webp';
                $targetPath = 'achievements/' . $fileName;
                Storage::disk('public')->put($targetPath, file_get_contents($sample));

                Achievement::create([
                    'poster' => $targetPath,
                ]);
            } else {
                // Kalau sample belum ada, tetap buat dummy path
                Achievement::create([
                    'poster' => 'achievements/dummy_' . ($index + 1) . '.webp',
                ]);
            }
        }
    }
}
