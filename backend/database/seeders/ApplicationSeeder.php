<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $alice = User::where('email', 'alice@example.com')->first();
        $mark  = User::where('email', 'mark@example.com')->first();

        $reactJob   = JobListing::where('title', 'Senior React Developer')->first();
        $laravelJob = JobListing::where('title', 'Laravel Backend Engineer')->first();
        $devopsJob  = JobListing::where('title', 'DevOps Engineer')->first();

        $applications = [
            [
                'user_id'        => $alice->id,
                'job_listing_id' => $reactJob->id,
                'resume'         => 'resumes/sample_alice_resume.pdf',
                'cover_letter'   => 'I am very excited about this React Developer role and believe my 4 years of experience make me a great fit.',
                'status'         => 'reviewed',
            ],
            [
                'user_id'        => $alice->id,
                'job_listing_id' => $laravelJob->id,
                'resume'         => 'resumes/sample_alice_resume.pdf',
                'cover_letter'   => 'Laravel has been my primary framework for 3 years. I would love to contribute to your backend team.',
                'status'         => 'pending',
            ],
            [
                'user_id'        => $mark->id,
                'job_listing_id' => $devopsJob->id,
                'resume'         => 'resumes/sample_mark_resume.pdf',
                'cover_letter'   => 'I have extensive experience with Kubernetes and AWS and am eager to join CloudBase.',
                'status'         => 'accepted',
            ],
            [
                'user_id'        => $mark->id,
                'job_listing_id' => $reactJob->id,
                'resume'         => 'resumes/sample_mark_resume.pdf',
                'cover_letter'   => null,
                'status'         => 'rejected',
            ],
        ];

        foreach ($applications as $app) {
            Application::firstOrCreate(
                ['user_id' => $app['user_id'], 'job_listing_id' => $app['job_listing_id']],
                $app
            );
        }
    }
}
