<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vaccine;

class VaccinePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('Vaccines_View');
    }

    public function view(User $user, Vaccine $vaccine): bool
    {
        return $user->hasPermissionTo('Vaccines_View');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('Vaccines_Create');
    }

    public function update(User $user, Vaccine $vaccine): bool
    {
        return $user->hasPermissionTo('Vaccines_Update');
    }

    public function delete(User $user, Vaccine $vaccine): bool
    {
        return $user->hasPermissionTo('Vaccines_Delete');
    }
}
