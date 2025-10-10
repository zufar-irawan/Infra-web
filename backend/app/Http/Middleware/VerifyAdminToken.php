<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VerifyAdminToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        // Token kosong → langsung unauthorized
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan pada header Authorization.'
            ], 401);
        }

        // Ambil admin berdasarkan token
        $admin = DB::table('admins')->where('api_token', $token)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid.'
            ], 401);
        }

        // (Opsional) Jika kamu punya kolom token_expires_at
        if (isset($admin->token_expires_at) && Carbon::now()->gt($admin->token_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Token sudah kedaluwarsa.'
            ], 401);
        }

        // Tambahkan data admin ke request (biar bisa dipakai di controller)
        $request->merge(['admin' => $admin]);

        return $next($request);
    }
}
