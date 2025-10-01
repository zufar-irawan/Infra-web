<?php

namespace App\Http\Controllers;

use App\Models\Rfid;
use Illuminate\Http\Request;
use App\Http\Requests\RfidRequest;
use DataTables;

class PresenceRfidController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view rfid|delete rfid', ['only' => ['index']]);
        $this->middleware('permission:delete rfid', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('website.rfid.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rfid $rfid)
    {
        $rfid->delete();
        toastr('RFID Deleted Successfully', 'success', 'RFID');

        return redirect()->route('rfids.index');
    }

    public function datatable()
    {
        $rfids = Rfid::orderBy('created_at', 'DESC');

        return DataTables::of($rfids)
            ->addIndexColumn()
            // Tampilkan kode RFID
            ->editColumn('code', function ($rfid) {
                return $rfid->code ?? '-';
            })
            // Tampilkan status aktif/tidak aktif
            ->editColumn('status', function ($rfid) {
                return $rfid->status == 0
                    ? "<span class='badge badge-success'>Tidak Aktif</span>"
                    : "<span class='badge badge-danger'>Aktif</span>";
            })
            ->addColumn('action', function ($rfid) {
                $action = '';
                if (auth()->user()->hasPermissionTo('delete rfid')) {
                    $action .= '<button onclick="deleteConfirm(\'' . $rfid->id . '\')" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>
                    <form method="POST" action="' . route('rfids.destroy', $rfid->id) . '" style="display:inline-block;" id="submit_' . $rfid->id . '">
                        ' . method_field('delete') . csrf_field() . '
                    </form>';
                }
                return empty($action) ? '-' : $action;
            })
            ->rawColumns(['status', 'action'])
            ->make(true);
    }
}
