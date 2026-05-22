<?php

namespace Database\Seeders;

use App\Models\Parents;
use Illuminate\Database\Seeder;

class ParentsSeeder extends Seeder
{
    public function run(): void
    {
        // child_ids 1-8 seeded by ChildrenSeeder
        $parents = [
            [
                'name'            => 'Blerim',
                'surname'         => 'Berisha',
                'email'           => 'blerim.berisha@gmail.com',
                'phone_number'    => 49100001,
                'personal_number' => 'KS2001000001',
                'child_id'        => 1,
            ],
            [
                'name'            => 'Hana',
                'surname'         => 'Berisha',
                'email'           => 'hana.berisha@gmail.com',
                'phone_number'    => 49100002,
                'personal_number' => 'KS2001000002',
                'child_id'        => 1,
            ],
            [
                'name'            => 'Mentor',
                'surname'         => 'Gashi',
                'email'           => 'mentor.gashi@gmail.com',
                'phone_number'    => 49100003,
                'personal_number' => 'KS2001000003',
                'child_id'        => 2,
            ],
            [
                'name'            => 'Vjollca',
                'surname'         => 'Krasniqi',
                'email'           => 'vjollca.krasniqi@gmail.com',
                'phone_number'    => 49100004,
                'personal_number' => 'KS2001000004',
                'child_id'        => 3,
            ],
            [
                'name'            => 'Naser',
                'surname'         => 'Hoxha',
                'email'           => 'naser.hoxha@gmail.com',
                'phone_number'    => 49100005,
                'personal_number' => 'KS2001000005',
                'child_id'        => 4,
            ],
            [
                'name'            => 'Albana',
                'surname'         => 'Kastrati',
                'email'           => 'albana.kastrati@gmail.com',
                'phone_number'    => 49100006,
                'personal_number' => 'KS2001000006',
                'child_id'        => 5,
            ],
            [
                'name'            => 'Qendrim',
                'surname'         => 'Musliu',
                'email'           => 'qendrim.musliu@gmail.com',
                'phone_number'    => 49100007,
                'personal_number' => 'KS2001000007',
                'child_id'        => 6,
            ],
            [
                'name'            => 'Mimoza',
                'surname'         => 'Shabani',
                'email'           => 'mimoza.shabani@gmail.com',
                'phone_number'    => 49100008,
                'personal_number' => 'KS2001000008',
                'child_id'        => 7,
            ],
            [
                'name'            => 'Bujar',
                'surname'         => 'Rama',
                'email'           => 'bujar.rama@gmail.com',
                'phone_number'    => 49100009,
                'personal_number' => 'KS2001000009',
                'child_id'        => 8,
            ],
        ];

        foreach ($parents as $parent) {
            Parents::create($parent);
        }
    }
}
