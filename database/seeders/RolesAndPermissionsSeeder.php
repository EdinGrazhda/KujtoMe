<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Always clear cache first so stale permissions don't cause conflicts
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Permissions ────────────────────────────────────────────────────────
        $permissions = [
            // Children
            'Children_View',
            'Children_Create',
            'Children_Update',
            'Children_Delete',

            // Doctors
            'Doctors_View',
            'Doctors_Create',
            'Doctors_Update',
            'Doctors_Delete',

            // Parents
            'Parents_View',
            'Parents_Create',
            'Parents_Update',
            'Parents_Delete',

            // Vaccines
            'Vaccines_View',
            'Vaccines_Create',
            'Vaccines_Update',
            'Vaccines_Delete',

            // Confirmations
            'Confirmations_View',
            'Confirmations_Create',
            'Confirmations_Update',
            'Confirmations_Delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ── Roles & their permission sets ──────────────────────────────────────

        // Admin — full access to every resource
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        // Doctor — read children/parents/vaccines; view & update confirmations
        $doctor = Role::firstOrCreate(['name' => 'Doctor', 'guard_name' => 'web']);
        $doctor->syncPermissions([
            'Children_View',
            'Parents_View',
            'Vaccines_View',
            'Confirmations_View',
            'Confirmations_Update',
        ]);

        // Parent — manage their own children and view vaccination records
        $parent = Role::firstOrCreate(['name' => 'Parent', 'guard_name' => 'web']);
        $parent->syncPermissions([
            'Children_View',
            'Children_Create',
            'Children_Update',
            'Vaccines_View',
            'Confirmations_View',
            'Confirmations_Create',
        ]);

        // Child — view-only access to their own profile and confirmations
        $child = Role::firstOrCreate(['name' => 'Child', 'guard_name' => 'web']);
        $child->syncPermissions([
            'Children_View',
            'Confirmations_View',
        ]);

        $this->command->info('Roles and permissions seeded successfully.');
        $this->command->table(
            ['Role', 'Permissions'],
            [
                ['Admin',  'All (' . count($permissions) . ')'],
                ['Doctor', 'Children_View, Parents_View, Vaccines_View, Confirmations_View/Update'],
                ['Parent', 'Children_View, Vaccines_View, Confirmations_View'],
                ['Child',  'Children_View, Confirmations_View'],
            ]
        );
    }
}
