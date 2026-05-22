<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\doctor as Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DoctorController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Doctor::class, 'doctor');
    }

    public function index(): JsonResponse
    {
        try {
            $doctors = Doctor::with('child')->get();

            return response()->json($doctors, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve doctors.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'         => 'required|string|max:255',
                'surname'      => 'required|string|max:255',
                'email'        => 'required|email|unique:doctor,email',
                'phone_number' => 'required|string|max:30',
                'child_id'     => 'required|integer|exists:children,id',
                'status'       => 'required|in:pending,missed',
            ]);

            $doctor = Doctor::create($validated);
            $doctor->load('child');

            return response()->json($doctor, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create doctor.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Doctor $doctor): JsonResponse
    {
        try {
            $doctor->load('child');

            return response()->json($doctor, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Doctor not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve doctor.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'         => 'sometimes|string|max:255',
                'surname'      => 'sometimes|string|max:255',
                'email'        => ['sometimes', 'email', Rule::unique('doctor', 'email')->ignore($doctor->id)],
                'phone_number' => 'sometimes|string|max:30',
                'child_id'     => 'sometimes|integer|exists:children,id',
                'status'       => 'sometimes|in:pending,missed',
                'user_id'      => 'sometimes|nullable|integer|exists:users,id',
            ]);

            $doctor->update($validated);
            $doctor->load('child');

            return response()->json($doctor, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Doctor not found.'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update doctor.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        try {
            Doctor::destroy($doctor->id);

            return response()->json(['message' => 'Doctor deleted successfully.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Doctor not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete doctor.', 'error' => $e->getMessage()], 500);
        }
    }
}
