<?php 
// database/seeders/ExtracurricularSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Extracurricular;

class ExtracurricularSeeder extends Seeder
{
    public function run(): void
    {
        $list = [
            ['name_id'=>'Saman','name_en'=>'Saman Dance','img'=>'/svg/saman.svg','ig'=>'https://instagram.com/saman'],
            ['name_id'=>'PPOC','name_en'=>'PPOC','img'=>'/svg/ppoc.svg','ig'=>'https://instagram.com/ppoc'],
            ['name_id'=>'ICT Club','name_en'=>'ICT Club','img'=>'/svg/ict.svg','ig'=>'https://instagram.com/ictclub'],
            ['name_id'=>'Silat','name_en'=>'Silat','img'=>'/svg/silat.svg','ig'=>'https://instagram.com/silat'],
            ['name_id'=>'Badminton','name_en'=>'Badminton','img'=>'/svg/bultang.svg','ig'=>'https://instagram.com/badminton'],
        ];

        foreach ($list as $i => $item) {
            Extracurricular::create([
                ...$item,
                'is_active' => true,
                'sort_order' => $i + 1,
            ]);
        }
    }
}
