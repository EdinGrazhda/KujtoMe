<?php

use App\Http\Controllers\API\ChildrenController;
use App\Http\Controllers\API\ConfirmationController;
use App\Http\Controllers\API\DoctorController;
use App\Http\Controllers\API\ParentsController;
use App\Http\Controllers\API\RolesController;
use App\Http\Controllers\API\UsersController;
use App\Http\Controllers\API\vaccineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Resource endpoints — guarded per-action by policies (authorizeResource in each controller)
    Route::apiResource('children', ChildrenController::class);
    Route::apiResource('doctors', DoctorController::class);
    Route::apiResource('parents', ParentsController::class);
    Route::apiResource('vaccines', vaccineController::class);
    Route::apiResource('confirmations', ConfirmationController::class);
    Route::post('confirmations/{id}/remind',      [ConfirmationController::class, 'remind']);
    Route::post('confirmations/{id}/doctor-call', [ConfirmationController::class, 'doctorCall']);

    // Roles & Users management — Admin only
    Route::middleware('role:Admin')->group(function () {
        Route::apiResource('roles', RolesController::class);
        Route::get('permissions', [RolesController::class, 'permissions']);
        Route::get('users', [UsersController::class, 'index']);
        Route::put('users/{id}/roles', [UsersController::class, 'updateRoles']);
    });
});
