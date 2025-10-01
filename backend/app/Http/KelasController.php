<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Http\Requests\KelasRequest;
use App\Models\Guru;
use Yajra\DataTables\DataTables;

class KelasController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view kelas|create kelas|edit kelas|delete kelas', ['only' => ['index']]);
        $this->middleware('permission:create kelas', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit kelas', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete kelas', ['only' => ['destroy']]);
    }

    public function index()
    {
        return view('website.kelas.index');
    }

    public function create()
    {
        $gurus = Guru::all();
        return view('website.kelas.create', compact('gurus'));
    }

    public function store(KelasRequest $request)
    {
        Kelas::create($request->all());
        toastr('Kelas Created Successfully', 'success', 'Kelas');
        return redirect()->route('kelas.index');
    }

    public function edit(Kelas $kelas)
    {
        $gurus = Guru::all();
        return view('website.kelas.edit', compact('kelas', 'gurus'));
    }

    public function update(KelasRequest $request, Kelas $kelas)
    {
        $kelas->update($request->all());
        toastr('Kelas Updated Successfully', 'success', 'Kelas');
        return redirect()->route('kelas.index');
    }

    public function destroy(Kelas $kelas)
    {
        $kelas->delete();
        toastr('Kelas Deleted Successfully', 'success', 'Kelas');
        return redirect()->route('kelas.index');
    }

    public function datatable()
    {
        $kelas = Kelas::orderBy('created_at', 'DESC');

        return DataTables::of($kelas)
            ->addIndexColumn()
            ->editColumn('nama', function ($kelas) {
                return $kelas->nama ? $kelas->nama : "<span class='badge badge-danger'>Nama Tidak Terdaftar</span>";
            })
            ->addColumn('guru_nama', function ($kelas) {
                return $kelas->guru && $kelas->guru->nama
                    ? $kelas->guru->nama
                    : "<span class='badge badge-danger'>Guru Tidak Ada</span>";
            })
            ->addColumn('guru_telepon', function ($kelas) {
                return $kelas->guru && $kelas->guru->telepon
                    ? $kelas->guru->telepon
                    : "<span class='badge badge-secondary'>Tidak Ada Nomor</span>";
            })
            ->addColumn('action', function ($kelas) {
                $action = '';

                if (auth()->user()->hasPermissionTo('edit kelas')) {
                    $action .= '<a href="' . route('kelas.edit', $kelas->id) . '" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i> </a>';
                }

                if (auth()->user()->hasPermissionTo('delete kelas')) {
                    $action .= '<button onclick="deleteConfirm(\'' . $kelas->id . '\')" class="btn btn-danger btn-sm m-1"><i class="fa fa-trash"></i></button>
                    <form method="POST" action="' . route('kelas.destroy', $kelas->id) . '" style="display:inline-block;" id="submit_' . $kelas->id . '">
                        ' . method_field('delete') . csrf_field() . '
                    </form>';
                }

                return empty($action) ? '-' : $action;
            })
            ->rawColumns(['action', 'nama', 'guru_nama', 'guru_telepon'])
            ->make(true);
    }
}
