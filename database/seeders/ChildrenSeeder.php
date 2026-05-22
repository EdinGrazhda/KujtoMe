<?php

namespace Database\Seeders;

use App\Models\Children;
use Illuminate\Database\Seeder;

class ChildrenSeeder extends Seeder
{
    public function run(): void
    {
        $children = [
            [
                'name'            => 'Arta',
                'surname'         => 'Berisha',
                'date_of_birth'   => '2022-03-15',
                'gender'          => 'female',
                'personal_number' => 'KS1001000001',
                'blood_type'      => 'A+',
                'allergies'       => null,
                'chronic_diseases'=> null,
            ],
            [
                'name'            => 'Luan',
                'surname'         => 'Gashi',
                'date_of_birth'   => '2021-07-22',
                'gender'          => 'male',
                'personal_number' => 'KS1001000002',
                'blood_type'      => 'O+',
                'allergies'       => 'Penicillin',
                'chronic_diseases'=> null,
            ],
            [
                'name'            => 'Drita',
                'surname'         => 'Krasniqi',
                'date_of_birth'   => '2023-01-10',
                'gender'          => 'female',
                'personal_number' => 'KS1001000003',
                'blood_type'      => 'B+',
                'allergies'       => null,
                'chronic_diseases'=> null,
            ],
            [
                'name'            => 'Besnik',
                'surname'         => 'Hoxha',
                'date_of_birth'   => '2020-11-05',
                'gender'          => 'male',
                'personal_number' => 'KS1001000004',
                'blood_type'      => 'AB+',
                'allergies'       => 'Pollen',
                'chronic_diseases'=> 'Mild asthma',
            ],
            [
                'name'            => 'Vjosa',
                'surname'         => 'Kastrati',
                'date_of_birth'   => '2022-08-30',
                'gender'          => 'female',
                'personal_number' => 'KS1001000005',
                'blood_type'      => 'A-',
                'allergies'       => null,
                'chronic_diseases'=> null,
            ],
            [
                'name'            => 'Artan',
                'surname'         => 'Musliu',
                'date_of_birth'   => '2021-04-18',
                'gender'          => 'male',
                'personal_number' => 'KS1001000006',
                'blood_type'      => 'O-',
                'allergies'       => null,
                'chronic_diseases'=> null,
            ],
            [
                'name'            => 'Ermira',
                'surname'         => 'Shabani',
                'date_of_birth'   => '2023-06-03',
                'gender'          => 'female',
                'personal_number' => 'KS1001000007',
                'blood_type'      => 'B-',
                'allergies'       => 'Latex',
                'chronic_diseases'=> null,
            ],
            [
                'name'            => 'Fitim',
                'surname'         => 'Rama',
                'date_of_birth'   => '2020-09-12',
                'gender'          => 'male',
                'personal_number' => 'KS1001000008',
                'blood_type'      => 'A+',
                'allergies'       => null,
                'chronic_diseases'=> 'Type 1 diabetes',
            ],
        ];

        foreach ($children as $child) {
            Children::create($child);
        }
    }
}
