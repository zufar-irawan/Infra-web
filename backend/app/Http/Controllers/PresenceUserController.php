<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PresenceUser;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class PresenceUserController extends Controller
{
    /**
     * Display a listing of the users
     */
    public function index()
    {
        $users = PresenceUser::with('roles')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->pluck('name')->first(),
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:presence_users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|string|exists:roles,name',
        ]);

        try {
            $input = $request->all();
            $input['password'] = bcrypt($input['password']);

            $user = PresenceUser::create($input);
            $user->assignRole($request->input('role'));

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user->load('roles')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        $user = PresenceUser::with('roles')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->roles->pluck('name')->first(),
                'created_at' => $user->created_at
            ]
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name'     => 'sometimes|string|max:100',
            'email'    => 'sometimes|email|unique:presence_users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role'     => 'required|string|exists:roles,name',
        ]);

        try {
            $user = PresenceUser::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $input = $request->all();
            $input['password'] = $request->filled('password')
                ? bcrypt($request->password)
                : $user->password;

            $user->update($input);

            // Hapus role lama lalu assign role baru
            DB::table('model_has_roles')->where('model_id', $user->id)->delete();
            $user->assignRole($request->input('role'));

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user->load('roles')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy($id)
    {
        try {
            $user = PresenceUser::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all roles
     */
    public function roles()
    {
        $roles = Role::all(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
}
