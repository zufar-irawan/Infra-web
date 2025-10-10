<?php

namespace App\Http\Controllers;

use App\Models\LmsDevice as Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LmsDeviceController extends Controller
{
    /**
     * Display a listing of the devices.
     */
    public function index()
    {
        $devices = Device::all();

        return response()->json([
            'success' => true,
            'message' => 'List of all devices',
            'data' => $devices
        ], 200);
    }

    /**
     * Store a newly created device (manual ID required).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id'        => 'required|string|unique:lms_devices,id', // ✅ wajib dan unik
            'name'      => 'required|string|max:255',
            'mode'      => 'required|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $device = Device::create([
            'id'        => $request->id,
            'name'      => $request->name,
            'mode'      => $request->mode,
            'is_active' => $request->is_active ?? 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Device created successfully',
            'data'    => $device
        ], 201);
    }

    /**
     * Display the specified device.
     */
    public function show($id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Device details',
            'data' => $device
        ], 200);
    }

    /**
     * Update the specified device.
     */
    public function update(Request $request, $id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'      => 'sometimes|required|string|max:255',
            'mode'      => 'sometimes|required|string|max:100',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $device->update($request->only(['name', 'mode', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Device updated successfully',
            'data'    => $device
        ], 200);
    }

    /**
     * Remove the specified device (soft delete).
     */
    public function destroy($id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found'
            ], 404);
        }

        $device->delete();

        return response()->json([
            'success' => true,
            'message' => 'Device deleted successfully'
        ], 200);
    }

    /**
     * Toggle device active status.
     */
    public function toggleActive($id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found'
            ], 404);
        }

        $device->is_active = !$device->is_active;
        $device->save();

        return response()->json([
            'success' => true,
            'message' => 'Device status toggled successfully',
            'data'    => $device
        ], 200);
    }

    /**
     * Update only the mode (used for IoT switching).
     */
    public function updateMode(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mode' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $device = Device::find($id);

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found'
            ], 404);
        }

        $device->mode = $request->mode;
        $device->save();

        return response()->json([
            'success' => true,
            'message' => 'Device mode updated successfully',
            'data'    => $device
        ], 200);
    }
}
