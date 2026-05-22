<?php

namespace App\Policies;

use App\Models\Children;
use App\Models\User;

class ChildrenPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('Children_View');
    }

    public function view(User $user, Children $children): bool
    {
        return $user->hasPermissionTo('Children_View');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('Children_Create');
    }

    public function update(User $user, Children $children): bool
    {
        return $user->hasPermissionTo('Children_Update');
    }

    public function delete(User $user, Children $children): bool
    {
        return $user->hasPermissionTo('Children_Delete');
    }
}
