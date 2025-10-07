<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PresenceTeacherController extends Controller
{
    public function index()
    {
        $guru = Guru::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'success' => true,
            'data' => $guru
        ]);
    }

    /**
     * Store a newly created guru
     */
    public function store(GuruRequest $request)
    {
        try {
            $guru = Guru::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Guru created successfully',
                'data' => $guru
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create guru',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified guru
     */
    public function show($id)
    {
        $guru = Guru::find($id);

        if (!$guru) {
            return response()->json([
                'success' => false,
                'message' => 'Guru not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $guru
        ]);
    }

    /**
     * Update the specified guru
     */
    public function update(GuruRequest $request, $id)
    {
        try {
            $guru = Guru::find($id);

            if (!$guru) {
                return response()->json([
                    'success' => false,
                    'message' => 'Guru not found'
                ], 404);
            }

            $guru->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Guru updated successfully',
                'data' => $guru
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update guru',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified guru
     */
    public function destroy($id)
    {
        try {
            $guru = Guru::find($id);

            if (!$guru) {
                return response()->json([
                    'success' => false,
                    'message' => 'Guru not found'
                ], 404);
            }

            $guru->delete();

            return response()->json([
                'success' => true,
                'message' => 'Guru deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete guru',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
