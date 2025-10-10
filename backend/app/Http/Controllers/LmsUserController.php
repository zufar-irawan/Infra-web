<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsUser;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class LmsUserController extends Controller
{
    public function __construct()
    {
        // semua route ini hanya bisa diakses jika sudah login di guard lms_api
        $this->middleware('auth:lms_api')->only(['me', 'logout', 'index', 'store', 'show', 'update', 'destroy']);
    }

    /* ===================== AUTH ===================== */

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:lms_users,email',
            'password' => 'required|string|min:6',
            'role' => ['nullable', Rule::in(['admin', 'guru', 'siswa'])],
            'phone' => 'nullable|string|max:30|unique:lms_users,phone',
            'status' => ['nullable', Rule::in(['aktif', 'nonaktif'])],
        ]);

        $data['role'] = $data['role'] ?? 'siswa';
        $data['status'] = $data['status'] ?? 'aktif';
        $data['password'] = Hash::make($data['password']);

        $user = LmsUser::create($data);

        // buat token untuk guard lms_api
        $token = $user->createToken('lms_api_token', ['*'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Register success',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = LmsUser::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        // hapus token lama (opsional, supaya satu device satu token)
        $user->tokens()->delete();

        // buat token baru untuk guard lms_api
        $token = $user->createToken('lms_api_token', ['*'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login success',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ],
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => auth('lms_api')->user(),
        ]);
    }

    public function logout(Request $request)
    {
        $user = auth('lms_api')->user();
        $user?->currentAccessToken()?->delete();

        return response()->json(['success' => true, 'message' => 'Logged out']);
    }

    /* ===================== CRUD ===================== */

    public function index(Request $request)
    {
        $user = auth('lms_api')->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $perPage = (int) $request->input('per_page', 15) ?: 15;
        $users = LmsUser::orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Users fetched',
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = auth('lms_api')->user();
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:lms_users,email',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['admin', 'guru', 'siswa'])],
            'phone' => 'nullable|string|max:30|unique:lms_users,phone',
            'status' => ['required', Rule::in(['aktif', 'nonaktif'])],
        ]);

        $data['password'] = Hash::make($data['password']);
        $newUser = LmsUser::create($data);

        return response()->json([
            'success' => true,
            'message' => 'User created',
            'data' => $newUser,
        ], 201);
    }

    public function show(Request $request, LmsUser $user)
    {
        $auth = auth('lms_api')->user();
        if ($auth->role !== 'admin' && $auth->id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'User detail',
            'data' => $user,
        ]);
    }

    public function update(Request $request, LmsUser $user)
    {
        $auth = auth('lms_api')->user();
        if ($auth->role !== 'admin' && $auth->id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:150',
            'email' => ['sometimes', 'email', Rule::unique('lms_users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:6',
            'role' => ['sometimes', Rule::in(['admin', 'guru', 'siswa'])],
            'phone' => ['nullable', 'string', 'max:30', Rule::unique('lms_users', 'phone')->ignore($user->id)],
            'status' => ['sometimes', Rule::in(['aktif', 'nonaktif'])],
        ]);

        if ($auth->role !== 'admin') {
            unset($data['role'], $data['status']);
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User updated',
            'data' => $user,
        ]);
    }

    public function destroy(Request $request, LmsUser $user)
    {
        $auth = auth('lms_api')->user();
        if ($auth->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $user->delete();
        return response()->json(['success' => true, 'message' => 'User deleted']);
    }
}
