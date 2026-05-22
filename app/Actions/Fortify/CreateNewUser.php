<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Children as ChildrenModel;
use App\Models\doctor as DoctorModel;
use App\Models\Parents;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'role'     => ['required', 'in:Child,Parent'],
        ])->validate();

        $user = User::create([
            'name'     => $input['name'],
            'email'    => $input['email'],
            'password' => $input['password'],
        ]);

        $user->assignRole($input['role']);

        // Auto-link to an existing parent record if emails match, otherwise create one
        if ($input['role'] === 'Parent') {
            $linked = Parents::where('email', $user->email)
                              ->whereNull('user_id')
                              ->update(['user_id' => $user->id]);

            if (!$linked) {
                Parents::create([
                    'user_id' => $user->id,
                    'name'    => $input['name'],
                    'email'   => $user->email,
                ]);
            }
        }

        // Auto-link to an existing doctor record if emails match
        if ($input['role'] === 'Doctor') {
            DoctorModel::where('email', $user->email)
                       ->whereNull('user_id')
                       ->update(['user_id' => $user->id]);
        }

        // Create a child profile automatically when registering as Child
        if ($input['role'] === 'Child') {
            ChildrenModel::create([
                'user_id' => $user->id,
                'name'    => $input['name'],
            ]);
        }

        return $user;
    }
}
