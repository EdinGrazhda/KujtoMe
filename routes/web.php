<?php

use App\Models\Children;
use App\Models\Confirmation;
use App\Models\doctor;
use App\Models\Parents;
use App\Models\Vaccine;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Children CRUD pages
    Route::inertia('admin/children', 'Admin/Children/index')->name('admin.children.index');
    Route::inertia('admin/children/create', 'Admin/Children/create')->name('admin.children.create');
    Route::get('admin/children/{id}/edit', function (int $id) {
        $child = Children::findOrFail($id);
        return Inertia::render('Admin/Children/edit', ['child' => $child]);
    })->name('admin.children.edit');

    // Doctor CRUD pages
    Route::inertia('admin/doctors', 'Admin/Doctor/index')->name('admin.doctors.index');
    Route::inertia('admin/doctors/create', 'Admin/Doctor/create')->name('admin.doctors.create');
    Route::get('admin/doctors/{id}/edit', function (int $id) {
        $doctor = doctor::findOrFail($id);
        return Inertia::render('Admin/Doctor/edit', ['doctor' => $doctor]);
    })->name('admin.doctors.edit');

    // Parent CRUD pages
    Route::inertia('admin/parents', 'Admin/Parent/index')->name('admin.parents.index');
    Route::inertia('admin/parents/create', 'Admin/Parent/create')->name('admin.parents.create');
    Route::get('admin/parents/{id}/edit', function (int $id) {
        $parent = Parents::with(['children'])->findOrFail($id);
        return Inertia::render('Admin/Parent/edit', ['parent' => $parent]);
    })->name('admin.parents.edit');

    // Vaccine CRUD pages
    Route::inertia('admin/vaccines', 'Admin/Vaccine/index')->name('admin.vaccines.index');
    Route::inertia('admin/vaccines/create', 'Admin/Vaccine/create')->name('admin.vaccines.create');
    Route::get('admin/vaccines/{id}/edit', function (int $id) {
        $vaccine = Vaccine::findOrFail($id);
        return Inertia::render('Admin/Vaccine/edit', ['vaccine' => $vaccine]);
    })->name('admin.vaccines.edit');

    // Confirmation CRUD pages
    Route::inertia('admin/confirmations', 'Admin/Confirmation/index')->name('admin.confirmations.index');
    Route::inertia('admin/confirmations/create', 'Admin/Confirmation/create')->name('admin.confirmations.create');
    Route::get('admin/confirmations/{id}/edit', function (int $id) {
        $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);
        return Inertia::render('Admin/Confirmation/edit', ['confirmation' => $confirmation]);
    })->name('admin.confirmations.edit');

    // Child profile + timeline
    Route::get('admin/children/{id}/profile', function (int $id) {
        $child = Children::with(['doctors', 'parents'])->findOrFail($id);
        return Inertia::render('Admin/Children/profile', ['child' => $child]);
    })->name('admin.children.profile');

    // Child timeline (alias)
    Route::get('admin/children/{id}/timeline', function (int $id) {
        $child = Children::with(['doctors', 'parents'])->findOrFail($id);
        return Inertia::render('Admin/Children/profile', ['child' => $child]);
    })->name('admin.children.timeline');

    // Parent-facing confirmation page
    Route::get('confirm/{id}', function (int $id) {
        $confirmation = Confirmation::with(['child', 'parent', 'vaccine'])->findOrFail($id);
        return Inertia::render('Admin/Confirmation/parent', ['confirmation' => $confirmation]);
    })->name('confirmation.parent');
});

require __DIR__.'/settings.php';
