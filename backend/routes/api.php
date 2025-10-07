<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- WEB API ROUTES ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\BlogController;

// --- LEARNING MANAGEMENT SYSTEM (LMS) ---
use App\Http\Controllers\LmsUserController;
use App\Http\Controllers\LmsStudentController;
use App\Http\Controllers\LmsTeacherController;
use App\Http\Controllers\LmsClassController;
use App\Http\Controllers\LmsSubjectController;
use App\Http\Controllers\LmsClassStudentController;
use App\Http\Controllers\LmsClassTeacherController;
use App\Http\Controllers\LmsRoomController;
use App\Http\Controllers\LmsScheduleController;
use App\Http\Controllers\LmsScheduleImportController;
use App\Http\Controllers\LmsInfalController;
use App\Http\Controllers\LmsModuleController;
use App\Http\Controllers\LmsAssignmentController;
use App\Http\Controllers\LmsAssignmentSubmissionController;
use App\Http\Controllers\LmsExamController;
use App\Http\Controllers\LmsExamResultController;
use App\Http\Controllers\LmsExamQuestionController;
use App\Http\Controllers\LmsAttendanceController;
use App\Http\Controllers\LmsReportController;
use App\Http\Controllers\LmsFinanceController;

// --- PRESENCE SYSTEM ---
use App\Http\Controllers\PresenceApiController;
use App\Http\Controllers\PresenceUserController;
use App\Http\Controllers\PresenceSettingController as SettingController;
use App\Http\Controllers\PresenceRfidController as RfidController;
use App\Http\Controllers\PresenceClassController as KelasController;
use App\Http\Controllers\PresenceTeacherController as GuruController;
use App\Http\Controllers\PresenceDeviceController as DeviceController;
use App\Http\Controllers\PresenceStudentController as SiswaController;
use App\Http\Controllers\PresenceDashboardController as DashboardController;
use App\Http\Controllers\PresenceReportController as ReportController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // PRESTASI
    Route::apiResource('prestasi', PrestasiController::class);

    // PARTNER
    Route::apiResource('partners', PartnerController::class);

    // EVENT
    Route::apiResource('events', EventController::class);

    // BLOG
    Route::apiResource('blogs', BlogController::class);
});

Route::prefix('lms')->group(function () {
    Route::post('auth/register', [LmsUserController::class, 'register']);
    Route::post('auth/login', [LmsUserController::class, 'login']);
    Route::get('auth/me', [LmsUserController::class, 'me'])->middleware('auth:lms_api');

    Route::middleware('auth:lms_api')->group(function () {
        // Auth
        Route::post('auth/logout', [LmsUserController::class, 'logout']);

        // Master Data
        Route::apiResource('users', LmsUserController::class);
        Route::apiResource('students', LmsStudentController::class);
        Route::apiResource('teachers', LmsTeacherController::class);
        Route::apiResource('classes', LmsClassController::class);
        Route::apiResource('subjects', LmsSubjectController::class);

        // Pivot Tables
        Route::apiResource('class-students', LmsClassStudentController::class)->only(['index','store','destroy']);
        Route::apiResource('class-teachers', LmsClassTeacherController::class)->only(['index','store','destroy']);

        // Rooms & Schedules
        Route::apiResource('rooms', LmsRoomController::class);
        Route::apiResource('schedules', LmsScheduleController::class);
        Route::apiResource('schedule-imports', LmsScheduleImportController::class)->only(['index','store','show']);
        Route::apiResource('infals', LmsInfalController::class)->only(['index','store','update','destroy']);

        // Learning Content
        Route::apiResource('modules', LmsModuleController::class);

        // Assignments
        Route::apiResource('assignments', LmsAssignmentController::class);
        Route::apiResource('assignment-submissions', LmsAssignmentSubmissionController::class);

        // Exams
        Route::apiResource('exams', LmsExamController::class);
        Route::apiResource('exam-results', LmsExamResultController::class)->only(['index','store','show']);
        Route::apiResource('exam-questions', LmsExamQuestionController::class)->only(['index','store','show','update','destroy']);

        // Attendance
        Route::apiResource('attendance', LmsAttendanceController::class)->only(['index','store','show']);

        // Reports & Finance
        Route::apiResource('reports', LmsReportController::class)->only(['index','store','show']);
        Route::apiResource('finance', LmsFinanceController::class)->only(['index','store','show']);
    });
});


Route::prefix('presence')->group(function () {
    Route::post('/change-mode', [PresenceApiController::class, 'changeMode']);
    Route::post('/', [PresenceApiController::class, 'presence']);
    Route::apiResource('users', PresenceUserController::class);

    // Protected routes (perlu authentication)
    Route::middleware('auth:sanctum')->group(function () {
    
        // User routes
        // Route::apiResource('users', UserController::class);
        Route::get('roles', [PresenceUserController::class, 'roles']);
        
        // Setting routes
        Route::get('settings', [SettingController::class, 'index']);
        Route::post('settings', [SettingController::class, 'store']);
        Route::put('settings/{id}', [SettingController::class, 'update']);
        
        // RFID routes
        Route::apiResource('rfids', RfidController::class)->only(['index', 'show', 'destroy']);
        
        // Kelas routes
        Route::apiResource('kelas', KelasController::class);
        
        // Guru routes
        Route::apiResource('guru', GuruController::class);
        
        // Device routes
        Route::apiResource('devices', DeviceController::class);
        
        // Siswa routes
        Route::apiResource('siswa', SiswaController::class);
        Route::post('siswa/daftar-rfid', [SiswaController::class, 'daftarRfid']);
        
        // Presence routes
        Route::get('presences', [PresenceApiController::class, 'index']);
        Route::get('presences/today', [PresenceApiController::class, 'today']);
        
        // Dashboard routes
        Route::get('dashboard', [DashboardController::class, 'index']);
        Route::get('dashboard/statistics', [DashboardController::class, 'statistics']);
        
        // Report routes
        Route::get('reports/date', [ReportController::class, 'reportDate']);
        Route::get('reports/student', [ReportController::class, 'reportStudent']);
        Route::get('reports/student/{id}/presence', [ReportController::class, 'studentPresence']);
        Route::get('reports/rekap-absensi', [ReportController::class, 'rekapAbsensiSiswa']);
        Route::get('reports/detail-absensi', [ReportController::class, 'detailAbsensiSiswa']);
        Route::post('reports/export/date', [ReportController::class, 'reportDateExport']);
        Route::post('reports/export/rekap', [ReportController::class, 'rekapAbsensiSiswaExport']);
        Route::post('reports/export/detail', [ReportController::class, 'detailAbsensiSiswaExport']);
    });
});