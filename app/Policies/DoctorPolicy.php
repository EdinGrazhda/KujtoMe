<?php

namespace App\Policies;

use App\Models\doctor;
use App\Models\User;

class DoctorPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('Doctors_View');
    }

    public function view(User $user, doctor $doctor): bool
    {
        return $user->hasPermissionTo('Doctors_View');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('Doctors_Create');
    }

    public function update(User $user, doctor $doctor): bool
    {
        return $user->hasPermissionTo('Doctors_Update');
    }

    public function delete(User $user, doctor $doctor): bool
    {
        return $user->hasPermissionTo('Doctors_Delete');
    }
}
