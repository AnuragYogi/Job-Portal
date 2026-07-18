<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $recruiter1 = User::where('email', 'recruiter@jobportal.com')->first();
        $recruiter2 = User::where('email', 'recruiter2@jobportal.com')->first();

        Company::firstOrCreate(['user_id' => $recruiter1->id], [
            'name'        => 'TechNova Solutions',
            'description' => 'A leading software development company building next-gen web and mobile applications.',
            'location'    => 'New York, NY',
            'website'     => 'https://technova.example.com',
        ]);

        Company::firstOrCreate(['user_id' => $recruiter2->id], [
            'name'        => 'CloudBase Inc.',
            'description' => 'Cloud infrastructure and DevOps solutions for modern enterprises.',
            'location'    => 'San Francisco, CA',
            'website'     => 'https://cloudbase.example.com',
        ]);
    }
}
