<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public job routes
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/search', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/companies/{id}', [CompanyController::class, 'show']);

// Authenticated routes
Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // User routes
    Route::middleware('role:user,recruiter,admin')->group(function () {
        Route::post('/apply/{job_id}', [ApplicationController::class, 'apply']);
        Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    });

    // Recruiter routes
    Route::middleware('role:recruiter,admin')->group(function () {
        Route::post('/company', [CompanyController::class, 'store']);
        Route::get('/my-company', [CompanyController::class, 'myCompany']);
        Route::post('/jobs', [JobController::class, 'store']);
        Route::put('/jobs/{id}', [JobController::class, 'update']);
        Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
        Route::get('/my-jobs', [JobController::class, 'myJobs']);
        Route::get('/job/{id}/applicants', [JobController::class, 'applicants']);
        Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/jobs', [AdminController::class, 'jobs']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::delete('/jobs/{id}', [AdminController::class, 'deleteJob']);
    });
});
