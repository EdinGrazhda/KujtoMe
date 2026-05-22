<?php

namespace App\Policies;

use App\Models\Confirmation;
use App\Models\User;

class ConfirmationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('Confirmations_View');
    }

    public function view(User $user, Confirmation $confirmation): bool
    {
        return $user->hasPermissionTo('Confirmations_View');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('Confirmations_Create');
    }

    public function update(User $user, Confirmation $confirmation): bool
    {
        return $user->hasPermissionTo('Confirmations_Update');
    }

    public function delete(User $user, Confirmation $confirmation): bool
    {
        return $user->hasPermissionTo('Confirmations_Delete');
    }
}
