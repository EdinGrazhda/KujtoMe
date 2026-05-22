<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Parents;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ParentsController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $parents = Parents::with(['children.confirmations.vaccine'])->get();

            return response()->json($parents, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve parents.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'            => 'required|string|max:255',
                'surname'         => 'required|string|max:255',
                'email'           => 'required|email|unique:parent,email',
                'phone_number'    => 'required|integer',
                'personal_number' => 'required|string|unique:parent,personal_number',
                'child_ids'       => 'required|array|min:1',
                'child_ids.*'     => 'integer|exists:children,id',
            ]);

            $childIds = $validated['child_ids'];
            unset($validated['child_ids']);

            $parent = Parents::create($validated);
            $parent->children()->sync($childIds);
            $parent->load(['children.confirmations.vaccine']);

            return response()->json($parent, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create parent.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $parent = Parents::with(['children.confirmations.vaccine'])->findOrFail($id);

            return response()->json($parent, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Parent not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve parent.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $parent = Parents::findOrFail($id);

            $validated = $request->validate([
                'name'            => 'sometimes|string|max:255',
                'surname'         => 'sometimes|string|max:255',
                'email'           => ['sometimes', 'email', Rule::unique('parent', 'email')->ignore($parent->id)],
                'phone_number'    => 'sometimes|integer',
                'personal_number' => ['sometimes', 'string', Rule::unique('parent', 'personal_number')->ignore($parent->id)],
                'child_ids'       => 'sometimes|array',
                'child_ids.*'     => 'integer|exists:children,id',
            ]);

            if (array_key_exists('child_ids', $validated)) {
                $childIds = $validated['child_ids'];
                unset($validated['child_ids']);
                $parent->children()->sync($childIds);
            }

            $parent->update($validated);
            $parent->load(['children.confirmations.vaccine']);

            return response()->json($parent, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Parent not found.'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update parent.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $parent = Parents::findOrFail($id);
            $parent->children()->detach(); // clean up pivot
            $parent->delete();

            return response()->json(['message' => 'Parent deleted successfully.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Parent not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete parent.', 'error' => $e->getMessage()], 500);
        }
    }
}
