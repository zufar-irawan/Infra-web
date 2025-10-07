<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PresenceRfidController extends Controller
{
    public function index()
    {
        $rfids = Rfid::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'success' => true,
            'data' => $rfids
        ]);
    }

    /**
     * Display the specified RFID
     */
    public function show($id)
    {
        $rfid = Rfid::find($id);

        if (!$rfid) {
            return response()->json([
                'success' => false,
                'message' => 'RFID not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rfid
        ]);
    }

    /**
     * Remove the specified RFID
     */
    public function destroy($id)
    {
        try {
            $rfid = Rfid::find($id);

            if (!$rfid) {
                return response()->json([
                    'success' => false,
                    'message' => 'RFID not found'
                ], 404);
            }

            $rfid->delete();

            return response()->json([
                'success' => true,
                'message' => 'RFID deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete RFID',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
