<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LandingSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('admins')->insert([
            [
                'email' => 'anandiadavv@gmail.com',
                'api_token' => bin2hex(random_bytes(16)), // otomatis buat token unik
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'email' => 'davina4422.pplg1@smkprestasiprima.sch.id',
                'api_token' => bin2hex(random_bytes(16)), // otomatis buat token unik
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
