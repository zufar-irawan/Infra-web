<?php

namespace App\Http\Controllers;

use App\Models\LmsAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LmsAttendanceController extends Controller
{
    /**
     * Display a listing of attendance records.
     */
    public function index(Request $request)
    {
        $user = auth('lms_api')->user();

        // kalau admin/guru → lihat semua
        if (in_array($user->role, ['admin', 'guru'])) {
            $attendances = LmsAttendance::with(['class', 'student'])->get();
        } else {
            // kalau siswa → hanya lihat absensi dirinya
            $attendances = LmsAttendance::with(['class', 'student'])
                ->where('student_id', $user->id)
                ->get();
        }

        return response()->json([
            'success' => true,
            'message' => 'List of attendance records',
            'data'    => $attendances,
        ]);
    }

    /**
     * Store a newly created attendance record.
     */
    public function store(Request $request)
    {
        $user = auth('lms_api')->user();

        if (!in_array($user->role, ['admin', 'guru'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied: only admin or guru can create attendance records',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'class_id'           => 'required|exists:lms_classes,id',
            'student_id'         => 'required|exists:lms_students,id',
            'date'               => 'required|date',
            'attendance_status'  => 'required|in:tidak_absen_masuk,tidak_absen_pulang,absen_masuk,absen_pulang',
            'time_in'            => 'nullable|date_format:H:i',
            'time_out'           => 'nullable|date_format:H:i',
            'status'             => 'required|in:telat,tepat_waktu,sakit,izin,alfa',
            'description'        => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $attendance = LmsAttendance::create($request->only([
            'class_id',
            'student_id',
            'date',
            'attendance_status',
            'time_in',
            'time_out',
            'status',
            'description'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Attendance record created successfully',
            'data'    => $attendance
        ], 201);
    }

    /**
     * Display the specified attendance record.
     */
    public function show(Request $request, $id)
    {
        $user = auth('lms_api')->user();

        if (!in_array($user->role, ['admin', 'guru'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied: only admin or guru can view attendance details',
            ], 403);
        }

        $attendance = LmsAttendance::with(['class', 'student'])->find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Attendance record details',
            'data'    => $attendance
        ], 200);
    }

    /**
     * Update the specified attendance record.
     */
    public function update(Request $request, $id)
    {
        $user = auth('lms_api')->user();

        if (!in_array($user->role, ['admin', 'guru'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied: only admin or guru can update attendance records',
            ], 403);
        }

        $attendance = LmsAttendance::find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'class_id'           => 'sometimes|required|exists:lms_classes,id',
            'student_id'         => 'sometimes|required|exists:lms_students,id',
            'date'               => 'sometimes|required|date',
            'attendance_status'  => 'sometimes|required|in:tidak_absen_masuk,tidak_absen_pulang,absen_masuk,absen_pulang',
            'time_in'            => 'nullable|date_format:H:i',
            'time_out'           => 'nullable|date_format:H:i',
            'status'             => 'sometimes|required|in:telat,tepat_waktu,sakit,izin,alfa',
            'description'        => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $attendance->update($request->only([
            'class_id',
            'student_id',
            'date',
            'attendance_status',
            'time_in',
            'time_out',
            'status',
            'description'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Attendance record updated successfully',
            'data'    => $attendance
        ], 200);
    }

    /**
     * Remove the specified attendance record (soft delete).
     */
    public function destroy(Request $request, $id)
    {
        $user = auth('lms_api')->user();

        if (!in_array($user->role, ['admin', 'guru'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied: only admin or guru can delete attendance records',
            ], 403);
        }

        $attendance = LmsAttendance::find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found'
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attendance record deleted successfully'
        ], 200);
    }

    /**
     * Filter attendance by class, student, or date (optional endpoint).
     */
    public function filter(Request $request)
    {
        $user = auth('lms_api')->user();

        if (!$user->hasRole(['admin', 'guru'])) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied: only admin or guru can filter attendance records',
            ], 403);
        }

        $query = LmsAttendance::with(['class', 'student']);

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        $result = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Filtered attendance records',
            'data'    => $result
        ], 200);
    }
}
