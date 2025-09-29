<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LmsFinance;
use Illuminate\Http\Request;

class LmsFinanceController extends Controller
{
    public function index()
    {
        return response()->json(LmsFinance::with('creator')->paginate(15));
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:income,expense',
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'created_by' => 'required|exists:lms_users,id',
        ]);

        $finance = LmsFinance::create($request->all());
        return response()->json($finance, 201);
    }
}
