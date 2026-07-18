<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_users'        => User::count(),
            'total_recruiters'   => User::where('role', 'recruiter')->count(),
            'total_jobs'         => JobListing::count(),
            'active_jobs'        => JobListing::where('is_active', true)->count(),
            'total_applications' => Application::count(),
            'total_companies'    => Company::count(),
        ]);
    }

    public function users()
    {
        $users = User::latest()->paginate(20);
        return response()->json($users);
    }

    public function jobs()
    {
        $jobs = JobListing::with('company')->latest()->paginate(20);
        return response()->json($jobs);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    public function deleteJob($id)
    {
        $job = JobListing::findOrFail($id);
        $job->delete();
        return response()->json(['message' => 'Job deleted']);
    }
}
