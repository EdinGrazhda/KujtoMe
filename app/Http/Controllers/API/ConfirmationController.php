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

    public function remind(string $id): JsonResponse
    {
        try {
            $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);

            // TODO: dispatch a real notification/email to $confirmation->parent->email
            // For now we log the intent and return success.
            \Illuminate\Support\Facades\Log::info('Reminder requested', [
                'confirmation_id' => $confirmation->id,
                'parent_email'    => $confirmation->parent?->email,
                'vaccine'         => $confirmation->vaccine?->name,
            ]);

            return response()->json([
                'message' => 'Reminder sent to ' . ($confirmation->parent?->email ?? 'parent'),
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Confirmation not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send reminder.', 'error' => $e->getMessage()], 500);
        }
    }

    public function doctorCall(string $id): JsonResponse
    {
        try {
            $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);

            // TODO: dispatch a real doctor-call request notification.
            \Illuminate\Support\Facades\Log::info('Doctor call requested', [
                'confirmation_id' => $confirmation->id,
                'child'           => $confirmation->child?->name . ' ' . $confirmation->child?->surname,
            ]);

            return response()->json([
                'message' => 'Doctor call requested for ' . ($confirmation->child?->name ?? 'child'),
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Confirmation not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to request doctor call.', 'error' => $e->getMessage()], 500);
        }
    }
}
