<?php

use App\Models\Children;
use App\Models\Confirmation;
use App\Models\doctor;
use App\Models\Parents;
use App\Models\User;
use App\Models\Vaccine;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Children pages
    Route::middleware('permission:Children_View')->group(function () {
        Route::inertia('admin/children', 'Admin/Children/index')->name('admin.children.index');
        Route::get('admin/children/{id}/profile', function (int $id) {
            $child = Children::with(['doctors', 'parents'])->findOrFail($id);
            return Inertia::render('Admin/Children/profile', ['child' => $child]);
        })->name('admin.children.profile');
        Route::get('admin/children/{id}/timeline', function (int $id) {
            $child = Children::with(['doctors', 'parents'])->findOrFail($id);
            return Inertia::render('Admin/Children/profile', ['child' => $child]);
        })->name('admin.children.timeline');
    });
    Route::middleware('permission:Children_Create')->group(function () {
        Route::inertia('admin/children/create', 'Admin/Children/create')->name('admin.children.create');
    });
    Route::middleware('permission:Children_Update')->group(function () {
        Route::get('admin/children/{id}/edit', function (int $id) {
            $child = Children::findOrFail($id);
            return Inertia::render('Admin/Children/edit', ['child' => $child]);
        })->name('admin.children.edit');
    });

    // Doctor pages
    Route::middleware('permission:Doctors_View')->group(function () {
        Route::inertia('admin/doctors', 'Admin/Doctor/index')->name('admin.doctors.index');
    });
    Route::middleware('permission:Doctors_Create')->group(function () {
        Route::inertia('admin/doctors/create', 'Admin/Doctor/create')->name('admin.doctors.create');
    });
    Route::middleware('permission:Doctors_Update')->group(function () {
        Route::get('admin/doctors/{id}/edit', function (int $id) {
            $doctor = doctor::findOrFail($id);
            $doctorUsers = User::whereHas('roles', function ($q) {
                $q->where('name', 'Doctor');
            })->get(['id', 'name', 'email']);
            return Inertia::render('Admin/Doctor/edit', [
                'doctor'      => $doctor,
                'doctorUsers' => $doctorUsers,
            ]);
        })->name('admin.doctors.edit');
    });

    // Parent pages
    Route::middleware('permission:Parents_View')->group(function () {
        Route::inertia('admin/parents', 'Admin/Parent/index')->name('admin.parents.index');
    });
    Route::middleware('permission:Parents_Create')->group(function () {
        Route::inertia('admin/parents/create', 'Admin/Parent/create')->name('admin.parents.create');
    });
    Route::middleware('permission:Parents_Update')->group(function () {
        Route::get('admin/parents/{id}/edit', function (int $id) {
            $parent = Parents::with(['children'])->findOrFail($id);
            return Inertia::render('Admin/Parent/edit', ['parent' => $parent]);
        })->name('admin.parents.edit');
    });

    // Vaccine pages
    Route::middleware('permission:Vaccines_View')->group(function () {
        Route::inertia('admin/vaccines', 'Admin/Vaccine/index')->name('admin.vaccines.index');
    });
    Route::middleware('permission:Vaccines_Create')->group(function () {
        Route::inertia('admin/vaccines/create', 'Admin/Vaccine/create')->name('admin.vaccines.create');
    });
    Route::middleware('permission:Vaccines_Update')->group(function () {
        Route::get('admin/vaccines/{id}/edit', function (int $id) {
            $vaccine = Vaccine::findOrFail($id);
            return Inertia::render('Admin/Vaccine/edit', ['vaccine' => $vaccine]);
        })->name('admin.vaccines.edit');
    });

    // Confirmation pages
    Route::middleware('permission:Confirmations_View')->group(function () {
        Route::inertia('admin/confirmations', 'Admin/Confirmation/index')->name('admin.confirmations.index');
    });
    // Doctor appointments page
    Route::middleware('role:Doctor')->group(function () {
        Route::inertia('admin/doctor/appointments', 'Admin/Doctor/appointments')->name('admin.doctor.appointments');
    });
    Route::middleware('permission:Confirmations_Create')->group(function () {
        Route::inertia('admin/confirmations/create', 'Admin/Confirmation/create')->name('admin.confirmations.create');
    });
    Route::middleware('permission:Confirmations_Update')->group(function () {
        Route::get('admin/confirmations/{id}/edit', function (int $id) {
            $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);
            return Inertia::render('Admin/Confirmation/edit', ['confirmation' => $confirmation]);
        })->name('admin.confirmations.edit');
    });

    // Roles & Users — Admin only
    Route::middleware('role:Admin')->group(function () {
        Route::inertia('admin/roles', 'Admin/Roles/index')->name('admin.roles.index');
        Route::inertia('admin/roles/create', 'Admin/Roles/create')->name('admin.roles.create');
        Route::get('admin/roles/{id}/edit', function (int $id) {
            $role = \Spatie\Permission\Models\Role::with('permissions')->findOrFail($id);
            return Inertia::render('Admin/Roles/edit', ['role' => $role]);
        })->name('admin.roles.edit');
        Route::inertia('admin/users', 'Admin/Users/index')->name('admin.users.index');
    });

    // Parent-facing confirmation page — any authenticated user
    Route::get('confirm/{id}', function (int $id) {
        $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);
        return Inertia::render('Admin/Confirmation/parent', ['confirmation' => $confirmation]);
    })->name('confirmation.parent');

    // Reservation page — parents can book a vaccination for their child
    Route::middleware('permission:Confirmations_Create')->group(function () {
        Route::get('reservation', function () {
            $user = auth()->user();
            $parentProfile = $user->parentProfile?->load('children');
            $vaccines      = Vaccine::select('id', 'name', 'type', 'description', 'image')->get();
            $doctors       = doctor::select('id', 'name', 'surname', 'email', 'phone_number', 'status')->get();
            $confirmations = $parentProfile
                ? Confirmation::with(['child', 'vaccine', 'doctor'])
                    ->where('parent_id', $parentProfile->id)
                    ->orderByDesc('id')
                    ->get()
                : collect();

            return Inertia::render('reservation', [
                'parentProfile' => $parentProfile,
                'children'      => $parentProfile?->children ?? collect(),
                'vaccines'      => $vaccines,
                'doctors'       => $doctors,
                'confirmations' => $confirmations,
            ]);
        })->name('reservation');
    });
});

require __DIR__.'/settings.php';
