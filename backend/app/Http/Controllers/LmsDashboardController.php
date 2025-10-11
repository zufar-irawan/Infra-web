<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsUser;
use App\Models\LmsStudent;
use App\Models\LmsTeacher;
use App\Models\LmsExam;
use App\Models\LmsAttendance;
use Illuminate\Support\Facades\DB;

class LmsDashboardController extends Controller
{
    public function index()
    {
        // --- Statistik Umum ---
        $students = LmsStudent::count();
        $teachers = LmsTeacher::count();
        $exams = LmsExam::count();

        // --- Statistik Absensi ---
        $totalAttendance = LmsAttendance::count();
        $hadirCount = LmsAttendance::where('status', 'hadir')->count();
        $avgAttendance = $totalAttendance > 0
            ? round(($hadirCount / $totalAttendance) * 100, 1)
            : 0;

        // --- Distribusi Role User ---
        $roles = [
            'admin' => LmsUser::where('role', 'admin')->count(),
            'guru' => LmsUser::where('role', 'guru')->count(),
            'siswa' => LmsUser::where('role', 'siswa')->count(),
        ];

        // --- Grafik Absensi Mingguan ---
        $attendancePerDay = LmsAttendance::select(
                DB::raw('DAYOFWEEK(date) as day'),
                DB::raw('count(*) as total')
            )
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->mapWithKeys(fn($item) => [$item->day => $item->total]);

        // Format ke urutan hari (Minggu-Sabtu)
        $days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        $attendanceData = [];
        for ($i = 1; $i <= 7; $i++) {
            $attendanceData[] = $attendancePerDay[$i] ?? 0;
        }

        // --- Grafik Nilai Ujian per Mata Pelajaran ---
        $examScores = LmsExam::select('subject_id', DB::raw('AVG(average_score) as avg_score'))
            ->groupBy('subject_id')
            ->with('subject:id,name')
            ->get()
            ->map(fn($exam) => [
                'subject' => $exam->subject->name ?? 'Tidak diketahui',
                'avg_score' => round($exam->avg_score ?? 0, 1)
            ]);

        // --- Response JSON ---
        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'students' => $students,
                    'teachers' => $teachers,
                    'exams' => $exams,
                    'avgAttendance' => $avgAttendance,
                ],
                'roles' => $roles,
                'attendance' => [
                    'labels' => $days,
                    'data' => $attendanceData,
                ],
                'exam_scores' => $examScores,
            ],
        ]);
    }
}
