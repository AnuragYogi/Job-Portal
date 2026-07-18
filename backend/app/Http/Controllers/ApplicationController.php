<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    // User: apply to a job
    public function apply(Request $request, $jobId)
    {
        $validator = Validator::make($request->all(), [
            'resume'       => 'required|file|mimes:pdf|max:5120',
            'cover_letter' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = JobListing::findOrFail($jobId);

        // Check duplicate application
        $existing = Application::where('user_id', auth()->id())
            ->where('job_listing_id', $jobId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied for this job'], 409);
        }

        $resumePath = $request->file('resume')->store('resumes', 'public');

        $application = Application::create([
            'user_id'        => auth()->id(),
            'job_listing_id' => $jobId,
            'resume'         => $resumePath,
            'cover_letter'   => $request->cover_letter,
        ]);

        return response()->json([
            'message'     => 'Application submitted successfully',
            'application' => $application->load('job'),
        ], 201);
    }

    // User: my applications
    public function myApplications()
    {
        $applications = Application::with(['job.company'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($applications);
    }

    // Recruiter: update application status
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,reviewed,accepted,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application = Application::findOrFail($id);
        $application->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated', 'application' => $application]);
    }
}
