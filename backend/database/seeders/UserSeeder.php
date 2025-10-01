<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\PresenceUser as User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'view kelas']);
        Permission::create(['name' => 'create kelas']);
        Permission::create(['name' => 'edit kelas']);
        Permission::create(['name' => 'delete kelas']);

        Permission::create(['name' => 'view siswa']);
        Permission::create(['name' => 'create siswa']);
        Permission::create(['name' => 'edit siswa']);
        Permission::create(['name' => 'delete siswa']);

        Permission::create(['name' => 'view guru']);
        Permission::create(['name' => 'create guru']);
        Permission::create(['name' => 'edit guru']);
        Permission::create(['name' => 'delete guru']);

        Permission::create(['name' => 'view device']);
        Permission::create(['name' => 'create device']);
        Permission::create(['name' => 'edit device']);
        Permission::create(['name' => 'delete device']);

        Permission::create(['name' => 'view rfid']);
        Permission::create(['name' => 'delete rfid']);

        Permission::create(['name' => 'view user']);
        Permission::create(['name' => 'create user']);
        Permission::create(['name' => 'edit user']);
        Permission::create(['name' => 'delete user']);

        Permission::create(['name' => 'view role permission']);
        Permission::create(['name' => 'create role permission']);
        Permission::create(['name' => 'edit role permission']);
        Permission::create(['name' => 'delete role permission']);

        Permission::create(['name' => 'view setting']);
        Permission::create(['name' => 'edit setting']);

        Permission::create(['name' => 'view presence']);
        Permission::create(['name' => 'create presence']);

        Permission::create(['name' => 'view presence by date']);
        Permission::create(['name' => 'export excel presence by date']);
        Permission::create(['name' => 'export pdf presence by date']);

        Permission::create(['name' => 'view presence by siswa']);
        Permission::create(['name' => 'export excel presence by siswa']);
        Permission::create(['name' => 'export pdf presence by siswa']);

        $adminRole = Role::create(['name' => 'admin']);
        $permissions = Permission::get();
        $adminRole->syncPermissions($permissions);

        $admin = User::create([
            'name' => 'Admin Sekolah Prestasi Prima',
            'email' => 'admin@mail.com',
            'password' => bcrypt('12345678')
        ]);

        $admin->assignRole($adminRole);

        $userRole = Role::create(['name' => 'user']);
        $viewPermissions = Permission::where('name', 'like', 'view%')->get();
        $userRole->syncPermissions($viewPermissions);

        $user = User::create([
            'name' => 'Guru Sekolah Prestasi Prima',
            'email' => 'user@mail.com',
            'password' => bcrypt('12345678')
        ]);

        $user->assignRole($userRole);
    }
}
