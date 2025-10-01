<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Rfid;
use App\Models\Kelas;
use Illuminate\Http\Request;
use App\Http\Requests\SiswaRequest;
use Yajra\DataTables\DataTables;

class SiswaController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view siswa|create siswa|edit siswa|delete siswa', ['only' => ['index', 'show']]);
        $this->middleware('permission:create siswa', ['only' => ['create', 'store']]);
        $this->middleware('permission:edit siswa', ['only' => ['edit', 'update', 'daftarRfid']]);
        $this->middleware('permission:delete siswa', ['only' => ['destroy']]);
    }

    public function index()
    {
        $rfids = Rfid::where('status', 0)->get();
        $kelasList = Kelas::orderBy('nama')->get();
        return view('website.siswa.index', compact('rfids', 'kelasList'));
    }

    public function create()
    {
        $kelas = Kelas::all();
        $rfids = Rfid::all();

        return view('website.siswa.create', compact('kelas', 'rfids'));
    }

    public function store(SiswaRequest $request)
    {
        Siswa::create($request->all());

        toastr('Siswa Created Successfully', 'success', 'Siswa');
        return redirect()->route('siswa.index');
    }

    public function show(Siswa $siswa)
    {
        return view('website.siswa.show', compact('siswa'));
    }

    public function edit(Siswa $siswa)
    {
        $kelas = Kelas::all();
        $rfids = Rfid::where('status', 0)->get();

        return view('website.siswa.edit', compact('siswa', 'kelas', 'rfids'));
    }

    public function daftarRfid(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'code' => 'required|exists:rfids,code',
        ]);

        // Ambil data RFID berdasarkan code
        $rfid = Rfid::where('code', $request->code)->firstOrFail();

        // Update siswa
        $siswa = Siswa::findOrFail($request->siswa_id);
        $siswa->rfid_id = $rfid->id;
        $siswa->save();

        // Update RFID jadi aktif
        $rfid->update(['status' => 1]);

        toastr('RFID berhasil didaftarkan!', 'success', 'RFID');
        return redirect()->route('siswa.index');
    }

    public function update(SiswaRequest $request, Siswa $siswa)
    {
        $siswa->update($request->all());
        toastr('Siswa Updated Successfully', 'success', 'Siswa');

        return redirect()->route('siswa.index');
    }

    public function destroy(Siswa $siswa)
    {
        $siswa->delete();
        toastr('Siswa Deleted Successfully', 'success', 'Siswa');

        return redirect()->route('siswa.index');
    }

    public function datatable(Request $request)
    {
        $siswa = Siswa::with(['kelas', 'kelas.guru', 'rfid'])
            ->orderBy('created_at', 'DESC');

        return DataTables::of($siswa)
            ->addIndexColumn() // Nomor urut
    
            // NIS
            ->editColumn('nis', fn($s) => e($s->nis))
    
            // Nama
            ->editColumn('nama', fn($s) => e($s->nama))
    
            // Gender
            ->editColumn('gender', function ($s) {
                return $s->gender == 1
                    ? "<span class='badge badge-success'>Pria</span>"
                    : "<span class='badge badge-danger'>Wanita</span>";
            })
    
            // Kelas
            ->editColumn('kelas_id', fn($s) => $s->kelas?->nama ?? "<span class='badge badge-secondary'>No Kelas</span>")
    
            // Nomor Wali
            ->editColumn('telepon_wali', fn($s) => e($s->telepon_wali))
    
            // Guru Pengampu
            ->addColumn('guru_telepon', fn($s) => $s->kelas?->guru?->telepon ?? "<span class='badge badge-secondary'>No Guru</span>")
    
            // RFID
            ->editColumn('code', function ($s) {
                return $s->rfid?->code
                    ? e($s->rfid->code)
                    : '<button type="button" class="btn btn-primary btn-daftar-rfid" data-id="' . $s->id . '" data-toggle="modal" data-target="#modalRfid">Daftar RFID</button>';
            })
    
            // Tombol Aksi
            ->addColumn('action', function ($s) {
                $action = '';
                if (auth()->user()->hasPermissionTo('edit siswa')) {
                    $action .= '<a href="' . route('siswa.edit', $s->id) . '" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i></a>';
                }
                if (auth()->user()->hasPermissionTo('delete siswa')) {
                    $action .= '
                        <button onclick="deleteConfirm(\'' . $s->id . '\')" class="btn btn-danger btn-sm m-1"><i class="fa fa-trash"></i></button>
                        <form method="POST" action="' . route('siswa.destroy', $s->id) . '" style="display:inline-block;" id="submit_' . $s->id . '">
                            ' . method_field('delete') . csrf_field() . '
                        </form>';
                }
                return $action;
            })
    
            // Filter manual supaya search aman
            ->filter(function ($query) use ($request) {
                // Search global
                if (!empty($request->search['value'])) {
                    $search = $request->search['value'];
                    $query->where(function ($q) use ($search) {
                        $q->where('nis', 'like', "%{$search}%")
                          ->orWhere('nama', 'like', "%{$search}%")
                          ->orWhereHas('kelas', function ($qc) use ($search) {
                              $qc->where('nama', 'like', "%{$search}%")
                                 ->orWhereHas('guru', fn($qg) => $qg->where('telepon', 'like', "%{$search}%"));
                          })
                          ->orWhereHas('rfid', fn($qr) => $qr->where('code', 'like', "%{$search}%"));
                    });
                }
    
                // Filter per kelas jika request ada
                if (!empty($request->kelas_id)) {
                    $query->where('kelas_id', $request->kelas_id);
                }
            })
    
            // Kolom HTML
            ->rawColumns([
                'nis',
                'nama',
                'gender',
                'kelas_id',
                'telepon_wali',
                'guru_telepon',
                'code',
                'action'
            ])
            ->make(true);
    }
}
