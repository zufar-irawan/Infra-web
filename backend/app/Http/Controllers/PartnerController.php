<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;

class PartnerController extends Controller
{
    public function index()
    {
        return response()->json(Partner::paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'logo' => 'required|image|max:2048'
        ]);

        $path = $request->file('logo')->store('partners', 'public');

        $partner = Partner::create([
            'name' => $validated['name'],
            'logo' => $path
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Partner created successfully',
            'data' => $partner
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Partner::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $partner = Partner::findOrFail($id);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners', 'public');
            $partner->update(['logo' => $path]);
        }

        if ($request->has('name')) {
            $partner->update(['name' => $request->name]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Partner updated successfully',
            'data' => $partner
        ]);
    }

    public function destroy($id)
    {
        Partner::destroy($id);
        return response()->json(['success' => true, 'message' => 'Partner deleted successfully']);
    }
}
