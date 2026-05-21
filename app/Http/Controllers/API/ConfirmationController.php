<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Confirmation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfirmationController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $confirmations = Confirmation::with(['child', 'parent', 'vaccine'])->get();

            return response()->json($confirmations, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve confirmations.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'parent_id'  => 'required|integer|exists:parent,id',
                'child_id'   => 'required|integer|exists:children,id',
                'vaccine_id' => 'required|integer|exists:vaccine,id',
                'status'     => 'sometimes|in:pending,upcoming,delayed,missed,taken',
            ]);

            $confirmation = Confirmation::create($validated);
            $confirmation->load(['child', 'parent', 'vaccine']);

            return response()->json($confirmation, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create confirmation.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);

            return response()->json($confirmation, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Confirmation not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve confirmation.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $confirmation = Confirmation::findOrFail($id);

            $validated = $request->validate([
                'parent_id'  => 'sometimes|integer|exists:parent,id',
                'child_id'   => 'sometimes|integer|exists:children,id',
                'vaccine_id' => 'sometimes|integer|exists:vaccine,id',
                'status'     => 'sometimes|in:pending,upcoming,delayed,missed,taken',
            ]);

            $confirmation->update($validated);
            $confirmation->load(['child', 'parent', 'vaccine']);

            return response()->json($confirmation, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Confirmation not found.'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update confirmation.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $confirmation = Confirmation::findOrFail($id);
            $confirmation->delete();

            return response()->json(['message' => 'Confirmation deleted successfully.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Confirmation not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete confirmation.', 'error' => $e->getMessage()], 500);
        }
    }
}
