<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PresenceDevice as Device;
use Illuminate\Http\Request;
use App\Http\Requests\DeviceRequest;

class PresenceDeviceController extends Controller
{
    /**
     * Get all devices (list).
     */
    public function index()
    {
        $devices = Device::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'success' => true,
            'message' => 'List of devices',
            'data'    => $devices
        ]);
    }

    /**
     * Store a new device.
     */
    public function store(DeviceRequest $request)
    {
        $device = Device::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Device created successfully',
            'data'    => $device
        ], 201);
    }

    /**
     * Show detail of a device.
     */
    public function show(Device $device)
    {
        return response()->json([
            'success' => true,
            'message' => 'Device detail',
            'data'    => $device
        ]);
    }

    /**
     * Update device.
     */
    public function update(DeviceRequest $request, Device $device)
    {
        $device->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Device updated successfully',
            'data'    => $device
        ]);
    }

    /**
     * Delete device.
     */
    public function destroy(Device $device)
    {
        $device->delete();

        return response()->json([
            'success' => true,
            'message' => 'Device deleted successfully'
        ]);
    }
}
