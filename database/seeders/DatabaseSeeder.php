<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name'  => 'Admin',
            'email' => 'admin@kujtome.ks',
        ]);

        $this->call([
            VaccineSeeder::class,
            ChildrenSeeder::class,
            DoctorSeeder::class,
            ParentsSeeder::class,
            ConfirmationSeeder::class,
        ]);
    }
}
