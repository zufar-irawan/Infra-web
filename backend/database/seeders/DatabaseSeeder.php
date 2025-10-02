<?php

namespace Database\Seeders;

use App\Models\LmsUser;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        LmsUser::create([
            'name' => 'Admin',
            'email' => 'admin@mail.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
            'phone' => '081234567890',
            'status' => true,
            'created_at' => now()
        ]);

        LmsUser::create([
            'name' => 'Teacher',
            'email' => 'guru@mail.com',
            'password' => bcrypt('12345678'),
            'role' => 'teacher',
            'phone' => '081234567890',
            'status' => true,
            'created_at' => now()
        ]);

        LmsUser::create([
            'name' => 'Student',
            'email' => 'guru@mail.com',
            'password' => bcrypt('12345678'),
            'role' => 'student',
            'phone' => '081234567890',
            'status' => true,
            'created_at' => now()
        ]);

        $this->call([
            UserSeeder::class,
            // KelasSeeder::class,
            // SiswaSeeder::class,
            // GuruSeeder::class,
            // DeviceSeeder::class,
            // RfidSeeder::class,
            // RolePermissionSeeder::class,
            // PresenceSeeder::class,
        ]);
    }
}
