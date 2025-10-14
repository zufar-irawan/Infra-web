<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Staff;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan direktori storage/staff ada
        if (!Storage::exists('public/staff')) {
            Storage::makeDirectory('public/staff');
        }

        // Daftar file contoh (pastikan file ini ada di public/webp atau resources/assets)
        $samples = [
            ['id' => 'staff1_id.webp', 'en' => 'staff1_en.webp'],
            ['id' => 'staff2_id.webp', 'en' => 'staff2_en.webp'],
            ['id' => 'staff3_id.webp', 'en' => 'staff3_en.webp'],
        ];

        foreach ($samples as $s) {
            // Buat nama unik baru
            $new_id = 'staff_' . Str::random(8) . '.webp';
            $new_en = 'staff_' . Str::random(8) . '.webp';

            // Copy dari public/webp/ ke storage/app/public/staff/
            $source_id = public_path('webp/' . $s['id']);
            $source_en = public_path('webp/' . $s['en']);

            if (file_exists($source_id)) {
                Storage::put('public/staff/' . $new_id, file_get_contents($source_id));
            }
            if (file_exists($source_en)) {
                Storage::put('public/staff/' . $new_en, file_get_contents($source_en));
            }

            // Simpan ke database
            Staff::create([
                'img_id' => '/storage/staff/' . $new_id,
                'img_en' => '/storage/staff/' . $new_en,
            ]);
        }
    }
}
