<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\DataTables;

class PresenceUserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view user|create user|edit user|delete user', ['only' => ['index','show','datatable']]);
        $this->middleware('permission:create user', ['only' => ['store']]);
        $this->middleware('permission:edit user', ['only' => ['update']]);
        $this->middleware('permission:delete user', ['only' => ['destroy']]);
    }

    /**
     * GET /api/presence-users
     */
    public function index()
    {
        $users = User::with('roles')
            ->orderBy('created_at','desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $users
        ]);
    }

    /**
     * GET /api/presence-users/{id}
     */
    public function show(User $user)
    {
        $user->load('roles');

        return response()->json([
            'success' => true,
            'data'    => $user
        ]);
    }

    /**
     * POST /api/presence-users
     */
    public function store(UserRequest $request)
    {
        $input = $request->validated();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);
        $user->assignRole($request->input('role'));

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data'    => $user->load('roles')
        ], 201);
    }

    /**
     * PUT /api/presence-users/{id}
     */
    public function update(UserRequest $request, User $user)
    {
        $input = $request->validated();
        $input['password'] = $request->password
            ? bcrypt($request->password)
            : $user->password;

        $user->update($input);

        // reset role lama
        DB::table('model_has_roles')->where('model_id', $user->id)->delete();
        $user->assignRole($request->input('role'));

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data'    => $user->load('roles')
        ]);
    }

    /**
     * DELETE /api/presence-users/{id}
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * GET /api/datatable/presence-users
     * untuk DataTables server-side
     */
    public function datatable(Request $request)
    {
        $users = User::orderBy('created_at','DESC');

        return DataTables::of($users)
            ->addIndexColumn()
            ->addColumn('role', fn($u) => $u->roles->pluck('name')->first())
            ->addColumn('action', function($u){
                $action = '';

                if(auth()->user()->hasPermissionTo('edit user')) {
                    $action .= '<a href="/users/'.$u->id.'/edit" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i></a>';
                }

                if(auth()->user()->hasPermissionTo('delete user')) {
                    $action .= '<button onclick="deleteConfirm(\''.$u->id.'\')" class="btn btn-danger btn-sm m-1"><i class="fa fa-trash"></i></button>';
                }

                return $action ?: '-';
            })
            ->rawColumns(['action'])
            ->make(true);
    }
}
