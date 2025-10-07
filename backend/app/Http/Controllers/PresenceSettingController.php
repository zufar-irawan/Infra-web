<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PresenceSettingController extends Controller
{
    public function index()
    {
        $setting = Setting::first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $setting
        ]);
    }

    /**
     * Update or create setting
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'mulai_masuk_siswa' => 'required',
                'jam_masuk_siswa' => 'required',
                'jam_pulang_siswa' => 'required',
                'batas_pulang_siswa' => 'required',
            ]);

            $setting = Setting::updateOrCreate(
                ['id' => 1],
                $data
            );

            return response()->json([
                'success' => true,
                'message' => 'Setting saved successfully',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update existing setting
     */
    public function update(Request $request, $id)
    {
        try {
            $data = $request->validate([
                'mulai_masuk_siswa' => 'required',
                'jam_masuk_siswa' => 'required',
                'jam_pulang_siswa' => 'required',
                'batas_pulang_siswa' => 'required',
            ]);

            $setting = Setting::where('id', $id)->first();

            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Setting not found'
                ], 404);
            }

            $setting->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Setting updated successfully',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
