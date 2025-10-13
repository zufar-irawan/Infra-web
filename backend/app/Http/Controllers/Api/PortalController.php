<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PortalController extends Controller
{
    /**
     * Kirim kode verifikasi ke email admin yang terdaftar
     */
    public function requestCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Cek apakah email ada di tabel admins
        $admin = DB::table('admins')->where('email', $request->email)->first();
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Email tidak terdaftar di sistem.'
            ], 404);
        }

        // Generate kode verifikasi 6 digit (000000 - 999999)
        $kode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Simpan atau update kode ke tabel admin_verifications
        DB::table('admin_verifications')->updateOrInsert(
            ['email' => $request->email],
            [
                'code' => $kode,
                'expires_at' => Carbon::now()->addMinutes(5),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Kirim email berisi kode verifikasi (gunakan view emails/portal-login.blade.php)
        try {
            Mail::send('emails.portal-login', ['kode' => $kode], function ($msg) use ($request) {
                $msg->to($request->email)
                    ->subject('Kode Verifikasi Portal SMK Prestasi Prima');
            });

            return response()->json([
                'success' => true,
                'message' => 'Kode verifikasi telah dikirim ke email terdaftar.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verifikasi kode dan login
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|digits:6',
        ]);

        // Cek kode verifikasi di database
        $record = DB::table('admin_verifications')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Kode verifikasi salah atau tidak ditemukan.'
            ], 400);
        }

        if (Carbon::now()->gt($record->expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Kode verifikasi sudah kadaluarsa.'
            ], 400);
        }

        // Generate token login (32 karakter hex)
        $token = bin2hex(random_bytes(16));

        // Simpan token ke tabel admins
        DB::table('admins')->where('email', $request->email)->update([
            'api_token' => $token,
            'updated_at' => now()
        ]);

        // Hapus kode setelah berhasil
        DB::table('admin_verifications')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil. Selamat datang di Portal Admin.',
            'token'   => $token,
        ]);
    }

    /**
     * Cek token dari FE (validasi token aktif)
     */
    public function checkToken(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan.'
            ], 401);
        }

        $admin = DB::table('admins')->where('api_token', $token)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid atau sudah kedaluwarsa.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Token valid.',
            'email' => $admin->email,
        ]);
    }

    /**
     * Ambil data admin login untuk Dashboard
     */
    public function dashboard(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: token kosong'
            ], 401);
        }

        $admin = DB::table('admins')->where('api_token', $token)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: token tidak valid'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'email'   => $admin->email,
            'message' => 'Selamat datang, ' . $admin->email
        ]);
    }
}
