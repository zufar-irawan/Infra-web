<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PresenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // === Permissions ===
        $permissions = [
            // Kelas
            'view kelas', 'create kelas', 'edit kelas', 'delete kelas',
            // Siswa
            'view siswa', 'create siswa', 'edit siswa', 'delete siswa',
            // Guru
            'view guru', 'create guru', 'edit guru', 'delete guru',
            // Device
            'view device', 'create device', 'edit device', 'delete device',
            // RFID
            'view rfid', 'delete rfid',
            // User
            'view user', 'create user', 'edit user', 'delete user',
            // Role & Permission
            'view role permission', 'create role permission', 'edit role permission', 'delete role permission',
            // Setting
            'view setting', 'edit setting',
            // Presence
            'view presence', 'create presence',
            'view presence by date', 'export excel presence by date', 'export pdf presence by date',
            'view presence by siswa', 'export excel presence by siswa', 'export pdf presence by siswa',
        ];

        foreach ($permissions as $perm) {
            DB::table('presence_permissions')->insert([
                'name' => $perm,
                'guard_name' => 'presence',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // === Roles ===
        $adminRoleId = DB::table('presence_roles')->insertGetId([
            'name' => 'admin',
            'guard_name' => 'presence',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $userRoleId = DB::table('presence_roles')->insertGetId([
            'name' => 'user',
            'guard_name' => 'presence',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === Users ===
        $adminId = DB::table('presence_users')->insertGetId([
            'name' => 'Admin Sekolah Prestasi Prima',
            'email' => 'admin@mail.com',
            'password' => Hash::make('12345678'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $userId = DB::table('presence_users')->insertGetId([
            'name' => 'Guru Sekolah Prestasi Prima',
            'email' => 'user@mail.com',
            'password' => Hash::make('12345678'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // === Assign Roles to Users ===
        DB::table('presence_user_has_roles')->insert([
            ['user_id' => $adminId, 'role_id' => $adminRoleId],
            ['user_id' => $userId, 'role_id' => $userRoleId],
        ]);

        // === Assign Permissions ===
        // Admin → semua permission
        $allPermissions = DB::table('presence_permissions')->pluck('id');
        foreach ($allPermissions as $permId) {
            DB::table('presence_role_has_permissions')->insert([
                'role_id' => $adminRoleId,
                'permission_id' => $permId,
            ]);
        }

        // User → hanya permission yang "view%"
        $viewPermissions = DB::table('presence_permissions')
            ->where('name', 'like', 'view%')
            ->pluck('id');
        foreach ($viewPermissions as $permId) {
            DB::table('presence_role_has_permissions')->insert([
                'role_id' => $userRoleId,
                'permission_id' => $permId,
            ]);
        }
    }
}
