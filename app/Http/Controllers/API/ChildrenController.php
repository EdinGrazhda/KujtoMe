<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Children;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ChildrenController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Children::class, 'children');
    }

    public function index(): JsonResponse
    {
        try {
            $children = Children::all();

            return response()->json($children, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve children.', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'             => 'required|string|max:255',
                'surname'          => 'required|string|max:255',
                'date_of_birth'    => 'required|date',
                'gender'           => 'required|in:male,female,other',
                'personal_number'  => 'required|integer|unique:children,personal_number',
                'blood_type'       => 'required|string|max:10',
                'allergies'        => 'nullable|string|max:255',
                'chronic_diseases' => 'nullable|string|max:255',
            ]);

            $child = Children::create($validated);

            return response()->json($child, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create child.', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id): JsonResponse
    {
        try {
            $child = Children::findOrFail($id);

            return response()->json($child, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Child not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve child.', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $child = Children::findOrFail($id);

            $validated = $request->validate([
                'name'             => 'sometimes|string|max:255',
                'surname'          => 'sometimes|string|max:255',
                'date_of_birth'    => 'sometimes|date',
                'gender'           => 'sometimes|in:male,female,other',
                'personal_number'  => ['sometimes', 'integer', Rule::unique('children', 'personal_number')->ignore($child->id)],
                'blood_type'       => 'sometimes|string|max:10',
                'allergies'        => 'nullable|string|max:255',
                'chronic_diseases' => 'nullable|string|max:255',
            ]);

            $child->update($validated);

            return response()->json($child, 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Child not found.'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update child.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $child = Children::findOrFail($id);
            $child->delete();

            return response()->json(['message' => 'Child deleted successfully.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json(['message' => 'Child not found.'], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete child.', 'error' => $e->getMessage()], 500);
        }
    }
}
