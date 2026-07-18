<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    // Recruiter: create or update company profile
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'location'    => 'nullable|string',
            'website'     => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company = Company::updateOrCreate(
            ['user_id' => auth()->id()],
            $request->only(['name', 'description', 'location', 'website'])
        );

        return response()->json([
            'message' => 'Company profile saved',
            'company' => $company,
        ], 201);
    }

    // Recruiter: get own company
    public function myCompany()
    {
        $company = Company::where('user_id', auth()->id())->first();

        if (!$company) {
            return response()->json(['message' => 'No company profile found'], 404);
        }

        return response()->json($company);
    }

    // Public: get company by id
    public function show($id)
    {
        $company = Company::with('jobs')->findOrFail($id);
        return response()->json($company);
    }
}
