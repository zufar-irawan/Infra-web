<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LandingSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->insert([
            ['email' => 'superadmin@smkpp.sch.id'],
            ['email' => 'admin@smkpp.sch.id'],
        ]);
    }
}
