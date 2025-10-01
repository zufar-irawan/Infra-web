<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view setting|edit setting', ['only' => ['index']]);
        $this->middleware('permission:edit setting', ['only' => ['store', 'update']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $setting = Setting::first();
        return view('website.setting.index', compact('setting'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'mulai_masuk_siswa' => 'required',
            'jam_masuk_siswa' => 'required',
            'jam_pulang_siswa' => 'required',
            'batas_pulang_siswa' => 'required',
        ]);

        Setting::updateOrCreate(
            ['id' => 1], // atau key unik lain
            $data
        );

        return redirect()->route('settings.index')->with('success', 'Setting berhasil disimpan!');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'mulai_masuk_siswa' => 'required',
            'jam_masuk_siswa' => 'required',
            'jam_pulang_siswa' => 'required',
            'batas_pulang_siswa' => 'required',
        ]);

        Setting::where('id', $id)->update($data);

        return redirect()->route('settings.index')->with('success', 'Setting berhasil diupdate!');
    }
}
