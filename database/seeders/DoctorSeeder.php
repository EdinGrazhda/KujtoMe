<?php

namespace Database\Seeders;

use App\Models\doctor;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        // child_ids 1-8 seeded by ChildrenSeeder
        $doctors = [
            [
                'name'         => 'Agim',
                'surname'      => 'Krasniqi',
                'email'        => 'agim.krasniqi@health.ks',
                'phone_number' => 44100001,
                'child_id'     => 1,
                'status'       => 'pending',
            ],
            [
                'name'         => 'Shpresa',
                'surname'      => 'Berisha',
                'email'        => 'shpresa.berisha@health.ks',
                'phone_number' => 44100002,
                'child_id'     => 2,
                'status'       => 'pending',
            ],
            [
                'name'         => 'Besim',
                'surname'      => 'Gashi',
                'email'        => 'besim.gashi@health.ks',
                'phone_number' => 44100003,
                'child_id'     => 3,
                'status'       => 'pending',
            ],
            [
                'name'         => 'Lumnije',
                'surname'      => 'Hoxha',
                'email'        => 'lumnije.hoxha@health.ks',
                'phone_number' => 44100004,
                'child_id'     => 4,
                'status'       => 'missed',
            ],
            [
                'name'         => 'Valmir',
                'surname'      => 'Kastrati',
                'email'        => 'valmir.kastrati@health.ks',
                'phone_number' => 44100005,
                'child_id'     => 5,
                'status'       => 'pending',
            ],
            [
                'name'         => 'Teuta',
                'surname'      => 'Musliu',
                'email'        => 'teuta.musliu@health.ks',
                'phone_number' => 44100006,
                'child_id'     => 6,
                'status'       => 'pending',
            ],
            [
                'name'         => 'Driton',
                'surname'      => 'Shabani',
                'email'        => 'driton.shabani@health.ks',
                'phone_number' => 44100007,
                'child_id'     => 7,
                'status'       => 'missed',
            ],
            [
                'name'         => 'Flora',
                'surname'      => 'Rama',
                'email'        => 'flora.rama@health.ks',
                'phone_number' => 44100008,
                'child_id'     => 8,
                'status'       => 'pending',
            ],
        ];

        foreach ($doctors as $doc) {
            doctor::create($doc);
        }
    }
}
