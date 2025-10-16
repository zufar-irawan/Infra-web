<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Management;

class ManagementSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan folder management ada
        $managementPath = public_path('storage/management');
        if (!File::exists($managementPath)) {
            File::makeDirectory($managementPath, 0777, true, true);
        }

        // Copy contoh file dari public/img/staff (kalau sudah ada di sana)
        // atau kamu bisa ganti ke path lain sesuai file aslimu.
        $samples = [
            [
                'src_id' => public_path('img/staff/staff1-id.webp'),
                'src_en' => public_path('img/staff/staff1-en.webp'),
                'dest_id' => $managementPath . '/staff1-id.webp',
                'dest_en' => $managementPath . '/staff1-en.webp',
            ],
            [
                'src_id' => public_path('img/staff/staff2-id.webp'),
                'src_en' => public_path('img/staff/staff2-en.webp'),
                'dest_id' => $managementPath . '/staff2-id.webp',
                'dest_en' => $managementPath . '/staff2-en.webp',
            ],
        ];

        foreach ($samples as $sample) {
            // jika file contoh ada, salin ke folder storage/management/
            if (File::exists($sample['src_id']) && File::exists($sample['src_en'])) {
                File::copy($sample['src_id'], $sample['dest_id']);
                File::copy($sample['src_en'], $sample['dest_en']);
            }

            Management::create([
                'img_id' => 'management/' . basename($sample['dest_id']),
                'img_en' => 'management/' . basename($sample['dest_en']),
            ]);
        }

        $this->command->info('✅ ManagementSeeder berhasil dijalankan!');
    }
}
