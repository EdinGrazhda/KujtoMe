---
description: "Scaffold or update roles, permissions and their policy rules in this Laravel fleet management project (Spatie Permission). Use when adding a new role, adding a new permission, changing what a role can do, or re-seeding the access control table."
name: "Roles & Permissions Setup"
argument-hint: "Describe the change — e.g. 'add a Driver role with Devices_View' or 'give Moderator Devices_View'"
agent: "agent"
tools: [read_file, replace_string_in_file, create_file, grep_search]
---

You are working inside a **Laravel 10 + Spatie Permission** fleet management application.

## Project conventions

| Concept | Location |
|---|---|
| Seeder | `database/seeders/RolesAndPermissionsSeeder.php` |
| Policies | `app/Policies/*.php` |
| Gates | `app/Providers/AuthServiceProvider.php` |
| Guard | `web` (default) |

## Current roles

| Role | Description |
|---|---|
| `Admin` | Full access — unrestricted create / update / delete across every resource |
| `Moderator` | Read-only access to users, GPS data, roles and permissions |
| `User` | Basic access — can view devices and GPS data they are linked to |

## Current permissions

| Permission | Guards |
|---|---|
| `Users_View` | `UserPolicy::viewAny`, `UserPolicy::view` |
| `Devices_View` | `DevicePolicy::viewAny`, `DevicePolicy::view` |
| `Clients_View` | `GpsDataPolicy::viewAny`, `GpsDataPolicy::view` |
| `Role_View` | `RolePolicy::viewAny`, `RolePolicy::view` |
| `RolePermissions_View` | `PermissionsPolicy::viewAny`, `PermissionsPolicy::view` |

## Gates (AuthServiceProvider)

```php
Gate::define('isAdmin',     fn(User $u) => $u->hasRole('Admin'));
Gate::define('isModerator', fn(User $u) => $u->hasRole('Moderator'));
Gate::define('isUser',      fn(User $u) => $u->hasRole('User'));
```

## Task

Using the argument provided by the user, perform **one or more** of the following:

1. **Add a new permission** — call `Permission::firstOrCreate(['name' => '...'])` in the seeder and add a guard check in the relevant Policy.
2. **Add a new role** — call `Role::firstOrCreate(['name' => '...'])` in the seeder and assign the appropriate permissions via `syncPermissions([...])`.
3. **Change role permissions** — update the `syncPermissions` array for the target role in the seeder.
4. **Add a new policy method** — follow the existing pattern (`hasRole` + `hasPermission` private helper).
5. **Register a new Gate** — add it in `AuthServiceProvider::boot()`.

## Rules

- Always use `firstOrCreate` — never `create` alone — so the seeder is safe to re-run.
- Call `app()[PermissionRegistrar::class]->forgetCachedPermissions()` at the top of `run()`.
- Follow the existing permission naming convention: `<Resource>_<Action>` (e.g. `FuelConsumption_View`).
- After editing the seeder, remind the user to run:
  ```bash
  php artisan db:seed --class=RolesAndPermissionsSeeder
  ```
- Do **not** change unrelated code.
