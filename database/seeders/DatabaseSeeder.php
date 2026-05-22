<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            VaccineSeeder::class,
            ChildrenSeeder::class,
            DoctorSeeder::class,
            ParentsSeeder::class,
            ConfirmationSeeder::class,
        ]);
    }
}
