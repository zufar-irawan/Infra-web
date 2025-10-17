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
use App\Http\Controllers\LmsDeviceController;
use App\Http\Controllers\LmsSettingController;
use App\Http\Controllers\LmsRfidController;
use App\Http\Controllers\Device\PresenceController;

//PORTAL
use App\Http\Controllers\Api\PortalController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ExtracurricularController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\KegiatanController;
use App\Http\Controllers\Api\MitraController;
// use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\ManagementController;
use App\Http\Controllers\Api\FacilityController;
use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\TestimoniController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// AUTH
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::prefix('ai')->group(function () {
    Route::get('/prestasi', [PrestasiController::class, 'index']);
    Route::get('/partners', [PartnerController::class, 'index']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/blogs', [BlogController::class, 'index']);
});
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

    // API Device
    Route::get('devices/mode', [PresenceController::class, 'changeMode']);
    Route::get('presences/store', [PresenceController::class, 'presence']);

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
        Route::apiResource('attendance', LmsAttendanceController::class);
        Route::get('attendance-filter', [LmsAttendanceController::class, 'filter']);

        // RFID
        Route::apiResource('rfid', LmsRfidController::class)->only(['index','destroy']);

        // LMS Device Management
        Route::apiResource('devices', LmsDeviceController::class)->only(['index','store','show','update','destroy']);
        Route::patch('devices/{id}/toggle', [LmsDeviceController::class, 'toggleActive']);
        Route::patch('devices/{id}/mode', [LmsDeviceController::class, 'updateMode']);

        // Settings
        Route::apiResource('settings', LmsSettingController::class);

        // Reports & Finance
        Route::apiResource('reports', LmsReportController::class)->only(['index','store','show']);
    });
});



// PORTAL ADMIN API
Route::post('/auth/request-code', [PortalController::class, 'requestCode'])->middleware('throttle:3,1');
Route::post('/auth/verify-code', [PortalController::class, 'verifyCode']);
Route::get('/auth/check-token', [PortalController::class, 'checkToken']);
Route::get('/portal/dashboard', [PortalController::class, 'dashboard']);

// === FAQ API ===
// daftar FAQ untuk publik (tanpa login)
Route::get('/faq/list', [FaqController::class, 'publicList']);

// CRUD FAQ
Route::get('/faq', [FaqController::class, 'index']);     // tampil semua
Route::get('/faq/{id}', [FaqController::class, 'show']); // detail
Route::post('/faq', [FaqController::class, 'store']);    // tambah
Route::put('/faq/{id}', [FaqController::class, 'update']); // edit
Route::delete('/faq/{id}', [FaqController::class, 'destroy']); // hapus


// CRUD EKSKUL
Route::get('/ekskul/list', [ExtracurricularController::class, 'publicList']);
Route::get('/ekskul', [ExtracurricularController::class, 'index']);
Route::get('/ekskul/{ekskul}', [ExtracurricularController::class, 'show']);
Route::post('/ekskul', [ExtracurricularController::class, 'store']);
Route::put('/ekskul/{ekskul}', [ExtracurricularController::class, 'update']);
Route::delete('/ekskul/{ekskul}', [ExtracurricularController::class, 'destroy']);
Route::post('/upload/ekskul', [UploadController::class, 'uploadEkskulImage']);
Route::apiResource('ekskul', ExtracurricularController::class);

//CRUD KEGIATAN
Route::get('/kegiatan/public', [KegiatanController::class, 'publicList']);
Route::apiResource('kegiatan', KegiatanController::class);

//CRUD MITRA
Route::get('/mitra/public', [MitraController::class, 'publicList']);
Route::apiResource('mitra', MitraController::class);

// //CRUD STAFF
// Route::get('/staff/public', [StaffController::class, 'publicIndex']);
// Route::get('/staff', [StaffController::class, 'index']);
// Route::post('/staff', [StaffController::class, 'store']);
// Route::post('/staff/{id}', [StaffController::class, 'update']);
// Route::delete('/staff/{id}', [StaffController::class, 'destroy']);
Route::prefix('management')->group(function () {
    Route::get('/', [ManagementController::class, 'index']);
    Route::post('/', [ManagementController::class, 'store']);
    Route::post('/{id}', [ManagementController::class, 'update']); // pakai POST untuk FormData update
    Route::delete('/{id}', [ManagementController::class, 'destroy']);
    Route::get('/public', [ManagementController::class, 'public']); // endpoint untuk frontend user
});

//CRUD FASILITAS
Route::prefix('facilities')->group(function () {
    Route::get('/', [FacilityController::class, 'index']);
    Route::post('/', [FacilityController::class, 'store']);
    Route::post('/{id}', [FacilityController::class, 'update']);
    Route::delete('/{id}', [FacilityController::class, 'destroy']);
    Route::get('/public', [FacilityController::class, 'public']);
});

//PRESTASI
Route::apiResource('achievements', AchievementController::class);
Route::get('/achievements/public', [AchievementController::class, 'public']);

//BERITA
Route::apiResource('news', NewsController::class);

//TESTIMONI
Route::apiResource('testimoni', TestimoniController::class)->only(['index', 'store', 'update', 'destroy']);
