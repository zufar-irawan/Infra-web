<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PresenceClass as Kelas;
use App\Models\PresenceTeacher as Guru;
use Illuminate\Http\Request;
use App\Http\Requests\KelasRequest;
use Yajra\DataTables\Facades\DataTables;

class PresenceClassController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view kelas|create kelas|edit kelas|delete kelas', ['only' => ['index','show','datatable']]);
        $this->middleware('permission:create kelas', ['only' => ['store']]);
        $this->middleware('permission:edit kelas', ['only' => ['update']]);
        $this->middleware('permission:delete kelas', ['only' => ['destroy']]);
    }

    /**
     * GET /api/classes
     * Menampilkan semua kelas (paginated)
     */
    public function index()
    {
        $kelas = Kelas::with('guru')
            ->orderBy('created_at', 'DESC')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $kelas
        ]);
    }

    /**
     * GET /api/classes/{id}
     * Detail satu kelas
     */
    public function show(Kelas $class)
    {
        $class->load('guru');

        return response()->json([
            'success' => true,
            'data'    => $class
        ]);
    }

    /**
     * POST /api/classes
     * Tambah kelas baru
     */
    public function store(KelasRequest $request)
    {
        $kelas = Kelas::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Kelas created successfully',
            'data'    => $kelas
        ], 201);
    }

    /**
     * PUT /api/classes/{id}
     * Update kelas
     */
    public function update(KelasRequest $request, Kelas $class)
    {
        $class->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Kelas updated successfully',
            'data'    => $class
        ]);
    }

    /**
     * DELETE /api/classes/{id}
     * Hapus kelas
     */
    public function destroy(Kelas $class)
    {
        $class->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kelas deleted successfully'
        ]);
    }

    /**
     * GET /api/datatable/classes
     * Datatable server-side
     */
    public function datatable()
    {
        $kelas = Kelas::with('guru')
            ->orderBy('created_at', 'DESC');

        return DataTables::of($kelas)
            ->addIndexColumn()
            ->editColumn('nama', fn($k) =>
                $k->nama ?: "<span class='badge badge-danger'>Nama Tidak Terdaftar</span>"
            )
            ->addColumn('guru_nama', fn($k) =>
                $k->guru?->nama ?: "<span class='badge badge-danger'>Guru Tidak Ada</span>"
            )
            ->addColumn('guru_telepon', fn($k) =>
                $k->guru?->telepon ?: "<span class='badge badge-secondary'>Tidak Ada Nomor</span>"
            )
            ->addColumn('action', function($k) {
                $btn = '';
                if(auth()->user()->hasPermissionTo('edit kelas')) {
                    $btn .= '<a href="/classes/'.$k->id.'/edit" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i></a>';
                }
                if(auth()->user()->hasPermissionTo('delete kelas')) {
                    $btn .= '<button onclick="deleteConfirm(\''.$k->id.'\')" class="btn btn-danger btn-sm m-1"><i class="fa fa-trash"></i></button>';
                }
                return $btn ?: '-';
            })
            ->rawColumns(['nama','guru_nama','guru_telepon','action'])
            ->make(true);
    }
}

/*
// Ambil semua kelas
axios.get('/api/classes', {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => console.log(res.data))

// Tambah kelas baru
axios.post('/api/classes', {
  nama: 'X PPLG 1',
  guru_id: 5
}, { headers: { Authorization: `Bearer ${token}` } })

// Update kelas
axios.put('/api/classes/3', {
  nama: 'X PPLG 2',
  guru_id: 7
}, { headers: { Authorization: `Bearer ${token}` } })

// Hapus kelas
axios.delete('/api/classes/3', {
  headers: { Authorization: `Bearer ${token}` }
}) */