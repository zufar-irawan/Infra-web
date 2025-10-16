<?php 
// database/seeders/FaqSeeder.php
namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'q_id' => 'Dimana alamat SMK Prestasi Prima?',
                'a_id' => 'Alamat kami berada di Jl. Kayu Manis Timur No. 99, Jakarta Timur.',
                'q_en' => 'Where is SMK Prestasi Prima located?',
                'a_en' => 'Our address is Jl. Kayu Manis Timur No. 99, East Jakarta.',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'q_id' => 'Apa saja jurusan yang tersedia?',
                'a_id' => 'Kami memiliki jurusan RPL, TJKT, DKV, dan lainnya.',
                'q_en' => 'What majors are available?',
                'a_en' => 'We offer majors such as Software Engineering, Network Engineering, Visual Communication Design, and more.',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'q_id' => 'Apakah ada kegiatan ekstrakurikuler?',
                'a_id' => 'Ya, tersedia banyak ekstrakurikuler seperti futsal, basket, musik, dan robotik.',
                'q_en' => 'Are there extracurricular activities?',
                'a_en' => 'Yes, we provide many extracurriculars such as futsal, basketball, music, and robotics.',
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($rows as $row) {
            Faq::create($row);
        }
    }
}

