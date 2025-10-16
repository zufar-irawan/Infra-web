<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Staff;

class StaffController extends Controller
{
    /**
     * GET /api/staff/public
     */
    public function publicIndex()
    {
        $staff = Staff::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }

    /**
     * GET /api/staff
     */
    public function index()
    {
        $staff = Staff::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }

    /**
     * POST /api/staff
     * Simpan file LANGSUNG ke: backend/public/storage/staff/
     */
    public function store(Request $request)
    {
        $request->validate([
            'img_id' => 'required|image|mimes:webp|max:4096',
            'img_en' => 'required|image|mimes:webp|max:4096',
        ]);

        // Pastikan folder tujuan ada
        $dest = public_path('storage/staff'); // => backend/public/storage/staff
        if (!is_dir($dest)) {
            mkdir($dest, 0775, true);
        }

        // Generate nama file random .webp
        $fileIdName = Str::random(40) . '.webp';
        $fileEnName = Str::random(40) . '.webp';

        // Pindahkan file ke folder publik
        $request->file('img_id')->move($dest, $fileIdName);
        $request->file('img_en')->move($dest, $fileEnName);

        // URL yang dipakai FE
        $urlId = '/storage/staff/' . $fileIdName;
        $urlEn = '/storage/staff/' . $fileEnName;

        $staff = Staff::create([
            'img_id' => $urlId,
            'img_en' => $urlEn,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data staff berhasil ditambahkan.',
            'data' => $staff,
        ], 201);
    }

    /**
     * POST /api/staff/{id}
     * Update file di: backend/public/storage/staff/
     */
    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $data = [];

        $dest = public_path('storage/staff');
        if (!is_dir($dest)) {
            mkdir($dest, 0775, true);
        }

        if ($request->hasFile('img_id')) {
            $request->validate(['img_id' => 'image|mimes:webp|max:4096']);

            // Hapus file lama (jika ada & file exist)
            if (!empty($staff->img_id)) {
                $old = public_path(ltrim($staff->img_id, '/')); // /storage/staff/xxx.webp
                if (is_file($old)) @unlink($old);
            }

            $newName = Str::random(40) . '.webp';
            $request->file('img_id')->move($dest, $newName);
            $data['img_id'] = '/storage/staff/' . $newName;
        }

        if ($request->hasFile('img_en')) {
            $request->validate(['img_en' => 'image|mimes:webp|max:4096']);

            if (!empty($staff->img_en)) {
                $old = public_path(ltrim($staff->img_en, '/'));
                if (is_file($old)) @unlink($old);
            }

            $newName = Str::random(40) . '.webp';
            $request->file('img_en')->move($dest, $newName);
            $data['img_en'] = '/storage/staff/' . $newName;
        }

        if (!empty($data)) {
            $staff->update($data);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data staff berhasil diperbarui.',
            'data' => $staff->fresh(),
        ]);
    }

    /**
     * DELETE /api/staff/{id}
     */
    public function destroy($id)
    {
        $staff = Staff::findOrFail($id);

        // Hapus file fisik
        if (!empty($staff->img_id)) {
            $p = public_path(ltrim($staff->img_id, '/'));
            if (is_file($p)) @unlink($p);
        }
        if (!empty($staff->img_en)) {
            $p = public_path(ltrim($staff->img_en, '/'));
            if (is_file($p)) @unlink($p);
        }

        $staff->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data staff berhasil dihapus.',
        ]);
    }
}
