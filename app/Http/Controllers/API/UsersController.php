<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Children as ChildrenModel;
use App\Models\doctor as DoctorModel;
use App\Models\Parents;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => 'nullable|string|exists:roles,name',
            'child_id' => 'nullable|integer|exists:children,id',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['role'])) {
            $user->assignRole($validated['role']);

            // Auto-link to an existing parent record if emails match
            if ($validated['role'] === 'Parent') {
                Parents::where('email', $user->email)
                       ->whereNull('user_id')
                       ->update(['user_id' => $user->id]);
            }

            // Auto-link to an existing doctor record if emails match
            if ($validated['role'] === 'Doctor') {
                DoctorModel::where('email', $user->email)
                           ->whereNull('user_id')
                           ->update(['user_id' => $user->id]);
            }

            // Link Child user to their children profile via explicit child_id
            if ($validated['role'] === 'Child' && !empty($validated['child_id'])) {
                ChildrenModel::where('id', $validated['child_id'])
                             ->whereNull('user_id')
                             ->update(['user_id' => $user->id]);
            }
        }

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->fresh('roles')->roles->pluck('name'),
        ], 201);
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
