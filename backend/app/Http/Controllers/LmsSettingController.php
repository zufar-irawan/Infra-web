<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LmsSettingController extends Controller
{
    /**
     * Display a listing of the settings.
     */
    public function index()
    {
        $settings = LmsSetting::all();

        return response()->json([
            'success' => true,
            'message' => 'List of all LMS settings',
            'data'    => $settings
        ], 200);
    }

    /**
     * Store a newly created setting.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mulai_masuk_siswa' => 'required|date_format:H:i',
            'jam_masuk_siswa'   => 'required|date_format:H:i',
            'jam_pulang_siswa'  => 'required|date_format:H:i',
            'batas_pulang_siswa'=> 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $setting = LmsSetting::create([
            'mulai_masuk_siswa'   => $request->mulai_masuk_siswa,
            'jam_masuk_siswa'     => $request->jam_masuk_siswa,
            'jam_pulang_siswa'    => $request->jam_pulang_siswa,
            'batas_pulang_siswa'  => $request->batas_pulang_siswa,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Setting created successfully',
            'data'    => $setting
        ], 201);
    }

    /**
     * Display a specific setting.
     */
    public function show($id)
    {
        $setting = LmsSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Setting detail',
            'data'    => $setting
        ], 200);
    }

    /**
     * Update a specific setting.
     */
    public function update(Request $request, $id)
    {
        $setting = LmsSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'mulai_masuk_siswa' => 'sometimes|required|date_format:H:i',
            'jam_masuk_siswa'   => 'sometimes|required|date_format:H:i',
            'jam_pulang_siswa'  => 'sometimes|required|date_format:H:i',
            'batas_pulang_siswa'=> 'sometimes|required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $setting->update($request->only([
            'mulai_masuk_siswa',
            'jam_masuk_siswa',
            'jam_pulang_siswa',
            'batas_pulang_siswa',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Setting updated successfully',
            'data'    => $setting
        ], 200);
    }

    /**
     * Remove a specific setting.
     */
    public function destroy($id)
    {
        $setting = LmsSetting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Setting deleted successfully'
        ], 200);
    }
}
