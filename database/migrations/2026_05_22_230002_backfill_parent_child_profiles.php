<?php

use App\Models\Children as ChildrenModel;
use App\Models\Parents;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill Parent records for users with Parent role who have no linked parent record
        $parentUsers = User::whereHas('roles', function ($q) {
            $q->where('name', 'Parent');
        })->get();

        foreach ($parentUsers as $user) {
            $linked = Parents::where('email', $user->email)
                             ->whereNull('user_id')
                             ->update(['user_id' => $user->id]);

            if (!$linked) {
                $alreadyExists = Parents::where('user_id', $user->id)->exists();
                if (!$alreadyExists) {
                    Parents::create([
                        'user_id' => $user->id,
                        'name'    => $user->name,
                        'email'   => $user->email,
                    ]);
                }
            }
        }

        // Backfill Children records for users with Child role who have no linked children record
        $childUsers = User::whereHas('roles', function ($q) {
            $q->where('name', 'Child');
        })->get();

        foreach ($childUsers as $user) {
            $alreadyExists = ChildrenModel::where('user_id', $user->id)->exists();
            if (!$alreadyExists) {
                ChildrenModel::create([
                    'user_id' => $user->id,
                    'name'    => $user->name,
                ]);
            }
        }
    }

    public function down(): void
    {
        // Cannot reliably reverse a data backfill
    }
};
