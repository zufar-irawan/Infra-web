<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LmsUser;
use App\Models\LmsClass;
use App\Models\LmsStudent;
use App\Models\LmsTeacher;
use App\Models\LmsSubject;
use App\Models\LmsRoom;
use App\Models\LmsSchedule;
use App\Models\LmsModule;
use App\Models\LmsAssignment;
use App\Models\LmsAssignmentSubmission;
use App\Models\LmsClassTeacher;
use App\Models\LmsClassStudent;
use App\Models\LmsInfal;
use App\Models\LmsScheduleImport;
use App\Models\LmsFile;
use Illuminate\Support\Facades\Hash;

class LmsSeeder extends Seeder
{
    public function run(): void
    {
        // === USERS ===
        $admin = LmsUser::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'status' => 'aktif',
        ]);

        $siswa = LmsUser::create([
            'name' => 'User Siswa',
            'email' => 'siswa@example.com',
            'password' => Hash::make('12345678'),
            'role' => 'siswa',
            'status' => 'aktif',
        ]);

        $guru = LmsUser::create([
            'name' => 'User Guru',
            'email' => 'guru@example.com',
            'password' => Hash::make('12345678'),
            'role' => 'guru',
            'status' => 'aktif',
        ]);

        // === CLASSES ===
        $class = LmsClass::create([
            'name' => 'X-PPLG-1',
            'description' => 'Kelas X PPLG 1',
            'status' => 'aktif',
        ]);

        // === STUDENTS ===
        $student = LmsStudent::create([
            'user_id' => $siswa->id,
            'nis' => '20250001',
            'class_id' => $class->id,
            'guardian_name' => 'Orang Tua A',
            'guardian_contact' => '0811111111',
            'enrollment_date' => '2025-07-01',
            'status' => 'aktif',
        ]);

        // === TEACHERS ===
        $teacher = LmsTeacher::create([
            'user_id' => $guru->id,
            'nip' => '198001012005011001',
            'specialization' => 'Matematika',
            'join_date' => '2020-01-01',
            'status' => 'aktif',
        ]);

        // === SUBJECTS ===
        $subject = LmsSubject::create([
            'code' => 'MAT10',
            'name' => 'Matematika X',
            'category' => 'Wajib',
            'description' => 'Dasar matematika',
            'weekly_hours' => 3,
            'status' => 'aktif',
        ]);

        // === ROOMS ===
        $room = LmsRoom::create([
            'name' => 'Lab-RPL',
            'capacity' => 32,
            'type' => 'lab',
            'status' => 'aktif',
        ]);

        // === CLASS-STUDENT ===
        LmsClassStudent::create([
            'class_id' => $class->id,
            'student_id' => $student->id,
        ]);

        // === CLASS-TEACHER ===
        LmsClassTeacher::create([
            'class_id' => $class->id,
            'teacher_id' => $teacher->id,
            'subject_id' => $subject->id,
        ]);

        // === SCHEDULES ===
        $schedule = LmsSchedule::create([
            'title' => 'Matematika X',
            'description' => 'Pertemuan rutin',
            'type' => 'admin',
            'target_type' => 'class',
            'target_id' => $class->id,
            'room_id' => $room->id,
            'day' => 'Senin',
            'start_time' => '08:00',
            'end_time' => '10:00',
            'created_by' => $admin->id,
            'is_practice_week' => false,
        ]);

        // === MODULES ===
        $module = LmsModule::create([
            'subject_id' => $subject->id,
            'title' => 'Modul 1 - Aljabar',
            'description' => 'Pengenalan aljabar',
            'status' => 'aktif',
        ]);

        // Add files to module
        LmsFile::create([
            'fileable_type' => LmsModule::class,
            'fileable_id' => $module->id,
            'type' => 'file',
            'path' => 'storage/modules/mat/aljabar.pdf',
            'name' => 'aljabar.pdf',
            'mime' => 'application/pdf',
            'size' => 1024 // size in KB
        ]);

        LmsFile::create([
            'fileable_type' => LmsModule::class,
            'fileable_id' => $module->id,
            'type' => 'image',
            'path' => 'storage/modules/mat/cover.png',
            'name' => 'cover.png',
            'mime' => 'image/png',
            'size' => 512
        ]);

        LmsFile::create([
            'fileable_type' => LmsModule::class,
            'fileable_id' => $module->id,
            'type' => 'link',
            'path' => 'https://drive.google.com/file/d/abc123/view',
            'name' => 'Google Drive Link'
        ]);

        // === ASSIGNMENTS ===
        $assignment = LmsAssignment::create([
            'class_id' => $class->id,
            'title' => 'Tugas 1 - Aljabar',
            'description' => 'Kerjakan soal di modul aljabar',
            'deadline' => '2025-10-01 23:59:00',
            'created_by' => $admin->id,
        ]);

        // Add files to assignment
        LmsFile::create([
            'fileable_type' => LmsAssignment::class,
            'fileable_id' => $assignment->id,
            'type' => 'file',
            'path' => 'storage/assignments/tugas1.pdf',
            'name' => 'tugas1.pdf',
            'mime' => 'application/pdf',
            'size' => 1024
        ]);

        // Add link to assignment
        LmsFile::create([
            'fileable_type' => LmsAssignment::class,
            'fileable_id' => $assignment->id,
            'type' => 'link',
            'path' => 'https://example.com/referensi/aljabar',
            'name' => 'Referensi Aljabar'
        ]);

        // === ASSIGNMENT SUBMISSION ===
        LmsAssignmentSubmission::create([
            'assignment_id' => $assignment->id,
            'student_id' => $student->id,
            'grade' => 90,
        ]);

        // === INFAL ===
        LmsInfal::create([
            'schedule_id' => $schedule->id,
            'teacher_original_id' => $teacher->id,
            'teacher_replacement_id' => $teacher->id,
            'reason' => 'Sakit',
            'assigned_by' => $admin->id,
        ]);

        // === SCHEDULE IMPORTS ===
        LmsScheduleImport::create([
            'file_path' => 'storage/imports/jadwal_2025.xlsx',
            'imported_by' => $admin->id,
            'imported_at' => '2025-09-01 07:00:00',
            'status' => 'success',
            'notes' => 'Batch awal semester ganjil',
        ]);
    }
}
