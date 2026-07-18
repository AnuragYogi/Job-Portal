<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::firstOrCreate(['email' => 'admin@jobportal.com'], [
            'name'     => 'Admin User',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Recruiter
        User::firstOrCreate(['email' => 'recruiter@jobportal.com'], [
            'name'     => 'Jane Recruiter',
            'password' => Hash::make('password'),
            'role'     => 'recruiter',
        ]);

        // Second Recruiter
        User::firstOrCreate(['email' => 'recruiter2@jobportal.com'], [
            'name'     => 'Bob Hiring',
            'password' => Hash::make('password'),
            'role'     => 'recruiter',
        ]);

        // Regular Users
        User::firstOrCreate(['email' => 'alice@example.com'], [
            'name'     => 'Alice Johnson',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        User::firstOrCreate(['email' => 'mark@example.com'], [
            'name'     => 'Mark Smith',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);
    }
}
