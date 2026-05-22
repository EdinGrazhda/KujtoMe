<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'Children_View', 'Children_Create', 'Children_Update', 'Children_Delete',
            'Doctors_View', 'Doctors_Create', 'Doctors_Update', 'Doctors_Delete',
            'Parents_View', 'Parents_Create', 'Parents_Update', 'Parents_Delete',
            'Vaccines_View', 'Vaccines_Create', 'Vaccines_Update', 'Vaccines_Delete',
            'Confirmations_View', 'Confirmations_Create', 'Confirmations_Update', 'Confirmations_Delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $doctor = Role::firstOrCreate(['name' => 'Doctor', 'guard_name' => 'web']);
        $doctor->syncPermissions([
            'Children_View', 'Parents_View', 'Vaccines_View',
            'Confirmations_View', 'Confirmations_Update',
        ]);

        $parent = Role::firstOrCreate(['name' => 'Parent', 'guard_name' => 'web']);
        $parent->syncPermissions([
            'Children_View', 'Vaccines_View', 'Confirmations_View',
        ]);

        $child = Role::firstOrCreate(['name' => 'Child', 'guard_name' => 'web']);
        $child->syncPermissions([
            'Children_View', 'Confirmations_View',
        ]);
    }

    public function down(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Role::whereIn('name', ['Admin', 'Doctor', 'Parent', 'Child'])->delete();

        Permission::whereIn('name', [
            'Children_View', 'Children_Create', 'Children_Update', 'Children_Delete',
            'Doctors_View', 'Doctors_Create', 'Doctors_Update', 'Doctors_Delete',
            'Parents_View', 'Parents_Create', 'Parents_Update', 'Parents_Delete',
            'Vaccines_View', 'Vaccines_Create', 'Vaccines_Update', 'Vaccines_Delete',
            'Confirmations_View', 'Confirmations_Create', 'Confirmations_Update', 'Confirmations_Delete',
        ])->delete();
    }
};
