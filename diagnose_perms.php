<?php
// Quick diagnostic — delete this file after use
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$admin = App\Models\User::whereHas('roles', fn($q) => $q->where('name','Admin'))->first();
if (!$admin) { echo "No admin user found\n"; exit(1); }

echo "User: " . $admin->email . "\n";
echo "Roles: " . $admin->getRoleNames()->implode(', ') . "\n";
echo "Children_Delete: " . ($admin->hasPermissionTo('Children_Delete') ? 'YES' : 'NO') . "\n";
echo "Doctors_Delete:  " . ($admin->hasPermissionTo('Doctors_Delete')  ? 'YES' : 'NO') . "\n";

$child = App\Models\Children::first();
$doc   = App\Models\doctor::first();

echo "can(delete, Child model):  " . ($admin->can('delete', $child) ? 'YES' : 'NO') . "\n";
echo "can(delete, Doctor model): " . ($admin->can('delete', $doc)   ? 'YES' : 'NO') . "\n";
echo "can(delete, 'App\Models\Children'): " . ($admin->can('delete', App\Models\Children::class) ? 'YES' : 'NO') . "\n";
echo "can(delete, 'App\Models\doctor'):   " . ($admin->can('delete', App\Models\doctor::class)   ? 'YES' : 'NO') . "\n";

// Simulate what authorizeResource middleware does
$routeParam = 9; // raw value from route
echo "can(delete, raw int 9):   " . ($admin->can('delete', $routeParam) ? 'YES' : 'NO') . "\n";
