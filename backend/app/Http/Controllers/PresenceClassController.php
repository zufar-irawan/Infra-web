<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PresenceClass as Kelas;


class PresenceClassController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with('guru')
            ->orderBy('created_at', 'DESC')
            ->get()
            ->map(function($k) {
                return [
                    'id' => $k->id,
                    'nama' => $k->nama,
                    'guru_nama' => $k->guru->nama ?? null,
                    'guru_telepon' => $k->guru->telepon ?? null,
                    'created_at' => $k->created_at
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $kelas
        ]);
    }

    /**
     * Store a newly created kelas
     */
    public function store(KelasRequest $request)
    {
        try {
            $kelas = Kelas::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Kelas created successfully',
                'data' => $kelas->load('guru')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified kelas
     */
    public function show($id)
    {
        $kelas = Kelas::with('guru')->find($id);

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $kelas
        ]);
    }

    /**
     * Update the specified kelas
     */
    public function update(KelasRequest $request, $id)
    {
        try {
            $kelas = Kelas::find($id);

            if (!$kelas) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kelas not found'
                ], 404);
            }

            $kelas->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Kelas updated successfully',
                'data' => $kelas->load('guru')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified kelas
     */
    public function destroy($id)
    {
        try {
            $kelas = Kelas::find($id);

            if (!$kelas) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kelas not found'
                ], 404);
            }

            $kelas->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kelas deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete kelas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
