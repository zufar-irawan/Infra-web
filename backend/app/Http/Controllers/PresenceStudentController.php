<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PresenceStudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view siswa|create siswa|edit siswa|delete siswa', ['only' => ['index', 'show', 'datatable']]);
        $this->middleware('permission:create siswa', ['only' => ['store']]);
        $this->middleware('permission:edit siswa', ['only' => ['update', 'daftarRfid']]);
        $this->middleware('permission:delete siswa', ['only' => ['destroy']]);
    }

    // GET /api/siswa
    public function index()
    {
        $siswa = Siswa::with(['kelas.guru','rfid'])
            ->orderBy('created_at','desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $siswa
        ]);
    }

    // POST /api/siswa
    public function store(SiswaRequest $request)
    {
        $siswa = Siswa::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Siswa created successfully',
            'data'    => $siswa
        ], 201);
    }

    // GET /api/siswa/{id}
    public function show(Siswa $siswa)
    {
        $siswa->load(['kelas.guru','rfid']);
        return response()->json([
            'success' => true,
            'data'    => $siswa
        ]);
    }

    // PUT /api/siswa/{id}
    public function update(SiswaRequest $request, Siswa $siswa)
    {
        $siswa->update($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Siswa updated successfully',
            'data'    => $siswa
        ]);
    }

    // DELETE /api/siswa/{id}
    public function destroy(Siswa $siswa)
    {
        $siswa->delete();
        return response()->json([
            'success' => true,
            'message' => 'Siswa deleted successfully'
        ]);
    }

    // POST /api/siswa/{id}/daftar-rfid
    public function daftarRfid(Request $request, Siswa $siswa)
    {
        $request->validate([
            'code' => 'required|exists:rfids,code'
        ]);

        $rfid = Rfid::where('code', $request->code)->firstOrFail();

        $siswa->rfid_id = $rfid->id;
        $siswa->save();

        $rfid->update(['status' => 1]);

        return response()->json([
            'success' => true,
            'message' => 'RFID berhasil didaftarkan!',
            'data'    => $siswa->load('rfid')
        ]);
    }

    // GET /api/datatable/siswa
    public function datatable(Request $request)
    {
        $siswa = Siswa::with(['kelas.guru', 'rfid'])
            ->orderBy('created_at', 'DESC');

        return DataTables::of($siswa)
            ->addIndexColumn()
            ->editColumn('gender', fn($s) =>
                $s->gender == 1 ? 'Pria' : 'Wanita'
            )
            ->editColumn('kelas_id', fn($s) =>
                $s->kelas?->nama ?? 'No Kelas'
            )
            ->addColumn('guru_telepon', fn($s) =>
                $s->kelas?->guru?->telepon ?? 'No Guru'
            )
            ->editColumn('code', fn($s) =>
                $s->rfid?->code ?? null
            )
            ->filter(function ($query) use ($request) {
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

                if (!empty($request->kelas_id)) {
                    $query->where('kelas_id', $request->kelas_id);
                }
            })
            ->make(true);
    }
}
