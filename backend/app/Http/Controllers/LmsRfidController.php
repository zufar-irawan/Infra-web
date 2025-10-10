<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsRfid;
use Illuminate\Http\Request;

class LmsRfidController extends Controller
{
    /**
     * Display a listing of RFID records (with optional search/filter).
     */
    public function index(Request $request)
    {
        $query = LmsRfid::query();

        // Optional search by code or status
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('code', 'LIKE', "%{$search}%")
                  ->orWhere('status', 'LIKE', "%{$search}%");
        }

        // You can add pagination if needed (uncomment below)
        // $rfids = $query->paginate(10);
        $rfids = $query->get();

        return response()->json([
            'success' => true,
            'message' => $rfids->isEmpty() 
                ? 'No RFID data found' 
                : 'List of RFID records',
            'data'    => $rfids
        ], 200);
    }

    /**
     * Remove the specified RFID record.
     */
    public function destroy($id)
    {
        $rfid = LmsRfid::find($id);

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
        ], 200);
    }
}
