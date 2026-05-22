<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')
            ->where('guard_name', 'web')
            ->get()
            ->map(fn (Role $role) => [
                'id'          => $role->id,
                'name'        => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ]);

        return response()->json($roles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255|unique:roles,name',
            'permissions'   => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name'], 'guard_name' => 'web']);
        $role->syncPermissions($validated['permissions'] ?? []);

        return response()->json([
            'id'          => $role->id,
            'name'        => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $role = Role::with('permissions')->where('guard_name', 'web')->findOrFail($id);

        return response()->json([
            'id'          => $role->id,
            'name'        => $role->name,
            'permissions' => $role->permissions->pluck('name'),
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $role = Role::where('guard_name', 'web')->findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255|unique:roles,name,' . $role->id,
            'permissions'   => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        if (isset($validated['name'])) {
            $role->update(['name' => $validated['name']]);
        }

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'id'          => $role->id,
            'name'        => $role->name,
            'permissions' => $role->fresh('permissions')->permissions->pluck('name'),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $role = Role::where('guard_name', 'web')->findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted.']);
    }

    public function permissions(): JsonResponse
    {
        $permissions = Permission::where('guard_name', 'web')->pluck('name');

        return response()->json($permissions);
    }
}
