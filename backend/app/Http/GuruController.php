<?php

namespace App\Http\Controllers;

use App\Models\PresenceTeacher as Guru;
use App\Http\Requests\GuruRequest;
use Yajra\DataTables\DataTables;

class GuruController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view guru|create guru|edit guru|delete guru', ['only' => ['index']]);
        $this->middleware('permission:create guru', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit guru', ['only' => ['edit', 'update']]);
        $this->middleware('permission:delete guru', ['only' => ['destroy']]);
    }

    public function index()
    {
        return view('website.guru.index');
    }

    public function create()
    {
        return view('website.guru.create');
    }

    public function store(GuruRequest $request)
    {
        Guru::create($request->all());
        toastr('Guru Created Successfully', 'success', 'Guru');

        return redirect()->route('guru.index');
    }

    public function edit(Guru $guru)
    {
        return view('website.guru.edit', compact('guru'));
    }

    public function update(GuruRequest $request, Guru $guru)
    {
        $guru->update($request->all());
        toastr('Guru Updated Successfully', 'success', 'guru');

        return redirect()->route('guru.index');
    }

    public function destroy(Guru $guru)
    {
        $guru->delete();
        toastr('Guru Deleted Successfully', 'success', 'guru');

        return redirect()->route('guru.index');
    }

    public function datatable()
    {
        $guru = Guru::orderBy('created_at', 'DESC');

        return DataTables::of($guru)
            ->addIndexColumn()
            ->editColumn('nama', function($guru) {
                return $guru->nama ? $guru->nama : "<span class='badge badge-danger'>Nama Tidak Terdaftar</span>"; 
            })
            ->editColumn('telepon', function($guru) {
                return $guru->telepon ? $guru->telepon : "<span class='badge badge-danger'>Nomor Telepon Tidak Terdaftar</span>"; 
            })
            ->addColumn('action', function($guru){
                $action = null;

                if(auth()->user()->hasPermissionTo('edit guru')) {
                    $action .= '<a href="'.route('guru.edit', $guru->id).'" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i> </a>';
                }

                if(auth()->user()->hasPermissionTo('delete guru')) {
                    $action .= '<button onclick="deleteConfirm(\''.$guru->id.'\')" class="btn btn-danger btn-sm m-1"><i class="fa fa-trash"></i></button>
                    <form method="POST" action="'.route('guru.destroy', $guru->id).'" style="display:inline-block;" id="submit_'.$guru->id.'">
                        '.method_field('delete').csrf_field().'
                    </form>';
                }

                return $action;
            })
            ->rawColumns(['action','nama', 'telepon'])
            ->make(true);
    }
}
