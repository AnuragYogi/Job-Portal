<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    // Public: list all active jobs (with optional search filters)
    public function index(Request $request)
    {
        $query = JobListing::with('company')->where('is_active', true);

        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $jobs = $query->latest()->get();

        return response()->json([
            'data'  => $jobs,
            'total' => $jobs->count(),
        ]);
    }

    // Public: dedicated search endpoint (GET /api/jobs/search?title=&location=)
    public function search(Request $request)
    {
        $title    = trim($request->query('title', ''));
        $location = trim($request->query('location', ''));

        $query = JobListing::with('company')->where('is_active', true);

        if ($title) {
            $query->where('title', 'like', '%' . $title . '%');
        }

        if ($location) {
            $query->where('location', 'like', '%' . $location . '%');
        }

        $jobs = $query->latest()->get();

        return response()->json([
            'data'  => $jobs,
            'total' => $jobs->count(),
        ]);
    }

    // Public: single job
    public function show($id)
    {
        $job = JobListing::with('company')->findOrFail($id);
        return response()->json($job);
    }

    // Recruiter: create job
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'salary'      => 'nullable|string',
            'location'    => 'required|string',
            'type'        => 'in:full-time,part-time,remote,contract',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $company = Company::where('user_id', auth()->id())->first();

        if (!$company) {
            return response()->json(['message' => 'Please create a company profile first'], 403);
        }

        $job = JobListing::create([
            'company_id'  => $company->id,
            'title'       => $request->title,
            'description' => $request->description,
            'salary'      => $request->salary,
            'location'    => $request->location,
            'type'        => $request->type ?? 'full-time',
        ]);

        return response()->json(['message' => 'Job posted successfully', 'job' => $job->load('company')], 201);
    }

    // Recruiter: update job
    public function update(Request $request, $id)
    {
        $company = Company::where('user_id', auth()->id())->first();
        $job = JobListing::where('id', $id)->where('company_id', $company?->id)->firstOrFail();

        $job->update($request->only(['title', 'description', 'salary', 'location', 'type', 'is_active']));

        return response()->json(['message' => 'Job updated', 'job' => $job]);
    }

    // Recruiter: delete job
    public function destroy($id)
    {
        $company = Company::where('user_id', auth()->id())->first();
        $job = JobListing::where('id', $id)->where('company_id', $company?->id)->firstOrFail();
        $job->delete();

        return response()->json(['message' => 'Job deleted']);
    }

    // Recruiter: my jobs
    public function myJobs()
    {
        $company = Company::where('user_id', auth()->id())->first();

        if (!$company) {
            return response()->json(['jobs' => []]);
        }

        $jobs = JobListing::with('company')
            ->where('company_id', $company->id)
            ->withCount('applications')
            ->latest()
            ->get();

        return response()->json($jobs);
    }

    // Recruiter: applicants for a job
    public function applicants($id)
    {
        $company = Company::where('user_id', auth()->id())->first();
        $job = JobListing::where('id', $id)->where('company_id', $company?->id)->firstOrFail();

        $applicants = $job->applications()->with('user')->latest()->get();

        return response()->json($applicants);
    }
}
