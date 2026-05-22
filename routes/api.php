<?php

use App\Http\Controllers\API\ChildrenController;
use App\Http\Controllers\API\ConfirmationController;
use App\Http\Controllers\API\DoctorController;
use App\Http\Controllers\API\ParentsController;
use App\Http\Controllers\API\vaccineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('children', ChildrenController::class);
    Route::apiResource('doctors', DoctorController::class);
    Route::apiResource('parents', ParentsController::class);
    Route::apiResource('vaccines', vaccineController::class);
    Route::apiResource('confirmations', ConfirmationController::class);
    Route::post('confirmations/{id}/remind',      [ConfirmationController::class, 'remind']);
    Route::post('confirmations/{id}/doctor-call', [ConfirmationController::class, 'doctorCall']);
});
