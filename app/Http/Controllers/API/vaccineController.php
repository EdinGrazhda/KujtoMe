<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vaccine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class vaccineController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $vaccines = Vaccine::all();

            return response()->json($vaccines, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve vaccines.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'code'                     => 'required|string|max:255|unique:vaccine,code',
                'name'                     => 'required|string|max:255',
                'protectsAgainst'          => 'required|string|max:255',
                'recommended_age_months'   => 'required|string|max:255',
                'image'                    => 'required|string|max:255',
                'description'              => 'required|string|max:255',
                'vaccination_municipality' => 'required|string|max:255',
                'dose'                     => 'required|string|max:255',
            ]);

            $vaccine = Vaccine::create($validated);

            return response()->json($vaccine, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create vaccine.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $vaccine = Vaccine::findOrFail($id);

            return response()->json($vaccine, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Vaccine not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve vaccine.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $vaccine = Vaccine::findOrFail($id);

            $validated = $request->validate([
                'code'                     => ['sometimes', 'string', 'max:255', Rule::unique('vaccine', 'code')->ignore($vaccine->id)],
                'name'                     => 'sometimes|string|max:255',
                'protectsAgainst'          => 'sometimes|string|max:255',
                'recommended_age_months'   => 'sometimes|string|max:255',
                'image'                    => 'sometimes|string|max:255',
                'description'              => 'sometimes|string|max:255',
                'vaccination_municipality' => 'sometimes|string|max:255',
                'dose'                     => 'sometimes|string|max:255',
            ]);

            $vaccine->update($validated);

            return response()->json($vaccine, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Vaccine not found.'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update vaccine.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $vaccine = Vaccine::findOrFail($id);
            $vaccine->delete();

            return response()->json(['message' => 'Vaccine deleted successfully.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Vaccine not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete vaccine.', 'error' => $e->getMessage()], 500);
        }
    }
}
