<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PresenceSettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view setting|edit setting', ['only' => ['index']]);
        $this->middleware('permission:edit setting', ['only' => ['store', 'update']]);
    }

    /**
     * GET /api/settings
     * Tampilkan setting pertama
     */
    public function index()
    {
        $setting = Setting::first();

        return response()->json([
            'success' => true,
            'data'    => $setting
        ]);
    }

    /**
     * POST /api/settings
     * Buat baru atau update record id=1
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'mulai_masuk_siswa' => 'required|date',
            'jam_masuk_siswa'   => 'required|date_format:H:i',
            'jam_pulang_siswa'  => 'required|date_format:H:i',
            'batas_pulang_siswa'=> 'required|date_format:H:i',
        ]);

        $setting = Setting::updateOrCreate(
            ['id' => 1],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => 'Setting berhasil disimpan!',
            'data'    => $setting
        ], 201);
    }

    /**
     * PUT /api/settings/{id}
     * Update by id
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'mulai_masuk_siswa' => 'required|date',
            'jam_masuk_siswa'   => 'required|date_format:H:i',
            'jam_pulang_siswa'  => 'required|date_format:H:i',
            'batas_pulang_siswa'=> 'required|date_format:H:i',
        ]);

        $setting = Setting::findOrFail($id);
        $setting->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Setting berhasil diupdate!',
            'data'    => $setting
        ]);
    }
}

/*

// CONTROH REQUEST DI FRONTEND

-- GET setting --
axios.get('/api/settings', { headers:{ Authorization: `Bearer ${token}` } })
     .then(res => console.log(res.data))

-- POST create/update --
axios.post('/api/settings', {
   mulai_masuk_siswa: '2025-10-07',
   jam_masuk_siswa: '07:00',
   jam_pulang_siswa: '15:00',
   batas_pulang_siswa: '17:00'
}, { headers:{ Authorization: `Bearer ${token}` }})
   .then(res => console.log(res.data))

-- PUT update by id --
axios.put('/api/settings/1', formData, { headers:{ Authorization: `Bearer ${token}` }})
*/