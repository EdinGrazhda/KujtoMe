<?php

namespace App\Policies;

use App\Models\Parents;
use App\Models\User;

class ParentsPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('Parents_View');
    }

    public function view(User $user, Parents $parents): bool
    {
        return $user->hasPermissionTo('Parents_View');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('Parents_Create');
    }

    public function update(User $user, Parents $parents): bool
    {
        return $user->hasPermissionTo('Parents_Update');
    }

    public function delete(User $user, Parents $parents): bool
    {
        return $user->hasPermissionTo('Parents_Delete');
    }
}
