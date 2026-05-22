<?php

namespace Database\Seeders;

use App\Models\Confirmation;
use Illuminate\Database\Seeder;

class ConfirmationSeeder extends Seeder
{
    public function run(): void
    {
        // parent_ids 1-9, child_ids 1-8, vaccine_ids 1-10 (seeded by their seeders)
        // Spread a realistic mix of statuses across children and vaccines
        $confirmations = [
            // Child 1 (Arta Berisha) — parent 1 (Blerim)
            ['parent_id' => 1, 'child_id' => 1, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 1, 'child_id' => 1, 'vaccine_id' => 2, 'status' => 'taken'],
            ['parent_id' => 1, 'child_id' => 1, 'vaccine_id' => 3, 'status' => 'upcoming'],
            ['parent_id' => 1, 'child_id' => 1, 'vaccine_id' => 7, 'status' => 'upcoming'],

            // Child 1 (Arta Berisha) — parent 2 (Hana, second parent)
            ['parent_id' => 2, 'child_id' => 1, 'vaccine_id' => 4, 'status' => 'pending'],

            // Child 2 (Luan Gashi) — parent 3 (Mentor)
            ['parent_id' => 3, 'child_id' => 2, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 3, 'child_id' => 2, 'vaccine_id' => 2, 'status' => 'taken'],
            ['parent_id' => 3, 'child_id' => 2, 'vaccine_id' => 3, 'status' => 'taken'],
            ['parent_id' => 3, 'child_id' => 2, 'vaccine_id' => 4, 'status' => 'missed'],
            ['parent_id' => 3, 'child_id' => 2, 'vaccine_id' => 5, 'status' => 'delayed'],

            // Child 3 (Drita Krasniqi) — parent 4 (Vjollca)
            ['parent_id' => 4, 'child_id' => 3, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 4, 'child_id' => 3, 'vaccine_id' => 2, 'status' => 'taken'],
            ['parent_id' => 4, 'child_id' => 3, 'vaccine_id' => 3, 'status' => 'pending'],
            ['parent_id' => 4, 'child_id' => 3, 'vaccine_id' => 6, 'status' => 'upcoming'],

            // Child 4 (Besnik Hoxha) — parent 5 (Naser)
            ['parent_id' => 5, 'child_id' => 4, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 5, 'child_id' => 4, 'vaccine_id' => 2, 'status' => 'taken'],
            ['parent_id' => 5, 'child_id' => 4, 'vaccine_id' => 3, 'status' => 'taken'],
            ['parent_id' => 5, 'child_id' => 4, 'vaccine_id' => 4, 'status' => 'taken'],
            ['parent_id' => 5, 'child_id' => 4, 'vaccine_id' => 7, 'status' => 'missed'],
            ['parent_id' => 5, 'child_id' => 4, 'vaccine_id' => 8, 'status' => 'missed'],

            // Child 5 (Vjosa Kastrati) — parent 6 (Albana)
            ['parent_id' => 6, 'child_id' => 5, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 6, 'child_id' => 5, 'vaccine_id' => 2, 'status' => 'upcoming'],
            ['parent_id' => 6, 'child_id' => 5, 'vaccine_id' => 3, 'status' => 'upcoming'],

            // Child 6 (Artan Musliu) — parent 7 (Qendrim)
            ['parent_id' => 7, 'child_id' => 6, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 7, 'child_id' => 6, 'vaccine_id' => 2, 'status' => 'taken'],
            ['parent_id' => 7, 'child_id' => 6, 'vaccine_id' => 3, 'status' => 'taken'],
            ['parent_id' => 7, 'child_id' => 6, 'vaccine_id' => 5, 'status' => 'delayed'],

            // Child 7 (Ermira Shabani) — parent 8 (Mimoza)
            ['parent_id' => 8, 'child_id' => 7, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 8, 'child_id' => 7, 'vaccine_id' => 3, 'status' => 'pending'],

            // Child 8 (Fitim Rama) — parent 9 (Bujar)
            ['parent_id' => 9, 'child_id' => 8, 'vaccine_id' => 1, 'status' => 'taken'],
            ['parent_id' => 9, 'child_id' => 8, 'vaccine_id' => 2, 'status' => 'taken'],
            ['parent_id' => 9, 'child_id' => 8, 'vaccine_id' => 3, 'status' => 'taken'],
            ['parent_id' => 9, 'child_id' => 8, 'vaccine_id' => 4, 'status' => 'taken'],
            ['parent_id' => 9, 'child_id' => 8, 'vaccine_id' => 5, 'status' => 'taken'],
            ['parent_id' => 9, 'child_id' => 8, 'vaccine_id' => 7, 'status' => 'delayed'],
        ];

        foreach ($confirmations as $conf) {
            Confirmation::create($conf);
        }
    }
}
