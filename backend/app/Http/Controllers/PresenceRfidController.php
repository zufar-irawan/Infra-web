<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Rfid;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class PresenceRfidController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view rfid|delete rfid', ['only' => ['index','datatable']]);
        $this->middleware('permission:delete rfid', ['only' => ['destroy']]);
    }

    /**
     * GET /api/rfids
     * List semua RFID
     */
    public function index()
    {
        $rfids = Rfid::orderBy('created_at', 'DESC')->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $rfids
        ]);
    }

    /**
     * DELETE /api/rfids/{id}
     * Hapus RFID
     */
    public function destroy(Rfid $rfid)
    {
        $rfid->delete();

        return response()->json([
            'success' => true,
            'message' => 'RFID deleted successfully'
        ]);
    }

    /**
     * GET /api/datatable/rfids
     * Untuk DataTables server-side
     */
    public function datatable(Request $request)
    {
        $rfids = Rfid::orderBy('created_at', 'DESC');

        return DataTables::of($rfids)
            ->addIndexColumn()
            // kolom code
            ->editColumn('code', fn($r) => $r->code ?? '-')
            // kolom status
            ->editColumn('status', fn($r) =>
                $r->status == 0
                    ? "<span class='badge badge-success'>Tidak Aktif</span>"
                    : "<span class='badge badge-danger'>Aktif</span>"
            )
            // kolom action
            ->addColumn('action', function ($r) {
                $btn = '';
                if (auth()->user()->hasPermissionTo('delete rfid')) {
                    $btn .= '<button onclick="deleteConfirm(\''.$r->id.'\')" class="btn btn-danger btn-sm">
                               <i class="fa fa-trash"></i>
                             </button>';
                }
                return $btn ?: '-';
            })
            ->rawColumns(['status','action'])
            ->make(true);
    }
}

/*
// ambil list RFID
axios.get('/api/rfids', { headers:{ Authorization:`Bearer ${token}` } })
     .then(res => console.log(res.data))

// hapus RFID
axios.delete('/api/rfids/12', { headers:{ Authorization:`Bearer ${token}` } })
     .then(res => console.log(res.data))

*/