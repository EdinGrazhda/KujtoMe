<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UsersController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('roles')->get()->map(fn (User $user) => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name'),
        ]);

        return response()->json($users);
    }

    public function updateRoles(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'roles'   => 'array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        $user = User::findOrFail($id);
        $user->syncRoles($validated['roles'] ?? []);

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->fresh('roles')->roles->pluck('name'),
        ]);
    }
}
