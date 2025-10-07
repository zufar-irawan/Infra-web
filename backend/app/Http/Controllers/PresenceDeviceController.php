<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;
use App\Http\Requests\DeviceRequest;
use Yajra\DataTables\DataTables;

class PresenceDeviceController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view device|create device|edit device|delete device', ['only' => ['index','show','datatable']]);
        $this->middleware('permission:create device', ['only' => ['store']]);
        $this->middleware('permission:edit device', ['only' => ['update']]);
        $this->middleware('permission:delete device', ['only' => ['destroy']]);
    }

    /**
     * GET /api/devices
     * Menampilkan semua device (paginated)
     */
    public function index()
    {
        $devices = Device::orderBy('created_at','desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $devices
        ]);
    }

    /**
     * GET /api/devices/{id}
     * Detail 1 device
     */
    public function show(Device $device)
    {
        return response()->json([
            'success' => true,
            'data'    => $device
        ]);
    }

    /**
     * POST /api/devices
     * Menambahkan device baru
     */
    public function store(DeviceRequest $request)
    {
        $device = Device::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Device created successfully',
            'data'    => $device
        ], 201);
    }

    /**
     * PUT /api/devices/{id}
     * Mengupdate device
     */
    public function update(DeviceRequest $request, Device $device)
    {
        $device->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Device updated successfully',
            'data'    => $device
        ]);
    }

    /**
     * DELETE /api/devices/{id}
     * Menghapus device
     */
    public function destroy(Device $device)
    {
        $device->delete();

        return response()->json([
            'success' => true,
            'message' => 'Device deleted successfully'
        ]);
    }

    /**
     * GET /api/datatable/devices
     * Endpoint untuk DataTables server-side
     */
    public function datatable(Request $request)
    {
        $devices = Device::orderBy('created_at', 'DESC');

        return DataTables::of($devices)
            ->addIndexColumn()
            ->editColumn('is_active', fn($d) =>
                $d->is_active == 1
                    ? "<span class='badge badge-success'>Aktif</span>"
                    : "<span class='badge badge-danger'>Non-Aktif</span>"
            )
            ->addColumn('action', function($d) {
                $btn = '';
                if(auth()->user()->hasPermissionTo('edit device')) {
                    $btn .= '<a href="/devices/'.$d->id.'/edit" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i></a>';
                }
                if(auth()->user()->hasPermissionTo('delete device')) {
                    $btn .= '<button onclick="deleteConfirm(\''.$d->id.'\')" class="btn btn-danger btn-sm m-1"><i class="fa fa-trash"></i></button>';
                }
                return $btn ?: '-';
            })
            ->rawColumns(['is_active','action'])
            ->make(true);
    }
}

/*

// Ambil semua device
axios.get('/api/devices', {
  headers: { Authorization: `Bearer ${token}` }
}).then(res => console.log(res.data))

// Tambah device
axios.post('/api/devices', {
  name: 'Reader 1',
  mode: 'reader',
  is_active: 1
}, { headers: { Authorization: `Bearer ${token}` } })

// Update device
axios.put('/api/devices/5', {
  name: 'Reader 1 Updated',
  is_active: 0
}, { headers: { Authorization: `Bearer ${token}` } })

// Hapus device
axios.delete('/api/devices/5', {
  headers: { Authorization: `Bearer ${token}` }
})

*/