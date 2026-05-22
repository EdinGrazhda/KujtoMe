<?php

namespace Database\Seeders;

use App\Models\Vaccine;
use Illuminate\Database\Seeder;

class VaccineSeeder extends Seeder
{
    public function run(): void
    {
        $vaccines = [
            [
                'code'                    => 'BCG',
                'name'                    => 'BCG Vaccine',
                'protectsAgainst'         => 'Tuberculosis',
                'recommended_age_months'  => '0',
                'description'             => 'Bacillus Calmette-Guérin vaccine given at birth to protect against tuberculosis.',
                'vaccination_municipality'=> 'Prishtinë',
                'dose'                    => '0.1ml intradermal',
                'image'                   => null,
            ],
            [
                'code'                    => 'HepB',
                'name'                    => 'Hepatitis B Vaccine',
                'protectsAgainst'         => 'Hepatitis B',
                'recommended_age_months'  => '0',
                'description'             => 'First dose given at birth; protects against Hepatitis B virus infection.',
                'vaccination_municipality'=> 'Prizren',
                'dose'                    => '0.5ml IM',
                'image'                   => null,
            ],
            [
                'code'                    => 'DTP',
                'name'                    => 'DTP Vaccine',
                'protectsAgainst'         => 'Diphtheria, Tetanus, Pertussis',
                'recommended_age_months'  => '2',
                'description'             => 'Combined vaccine against Diphtheria, Tetanus, and Whooping Cough.',
                'vaccination_municipality'=> 'Pejë',
                'dose'                    => '0.5ml IM',
                'image'                   => null,
            ],
            [
                'code'                    => 'IPV',
                'name'                    => 'Polio IPV Vaccine',
                'protectsAgainst'         => 'Poliomyelitis',
                'recommended_age_months'  => '2',
                'description'             => 'Inactivated Poliovirus Vaccine to prevent paralytic poliomyelitis.',
                'vaccination_municipality'=> 'Gjilan',
                'dose'                    => '0.5ml SC',
                'image'                   => null,
            ],
            [
                'code'                    => 'Hib',
                'name'                    => 'Hib Vaccine',
                'protectsAgainst'         => 'Haemophilus influenzae type b',
                'recommended_age_months'  => '2',
                'description'             => 'Protects against bacterial meningitis and pneumonia caused by Hib.',
                'vaccination_municipality'=> 'Mitrovicë',
                'dose'                    => '0.5ml IM',
                'image'                   => null,
            ],
            [
                'code'                    => 'PCV',
                'name'                    => 'Pneumococcal Vaccine',
                'protectsAgainst'         => 'Pneumococcal disease',
                'recommended_age_months'  => '2',
                'description'             => 'Protects against pneumococcal bacteria causing pneumonia, meningitis.',
                'vaccination_municipality'=> 'Ferizaj',
                'dose'                    => '0.5ml IM',
                'image'                   => null,
            ],
            [
                'code'                    => 'MMR',
                'name'                    => 'MMR Vaccine',
                'protectsAgainst'         => 'Measles, Mumps, Rubella',
                'recommended_age_months'  => '12',
                'description'             => 'Combined live-attenuated vaccine against measles, mumps, and rubella.',
                'vaccination_municipality'=> 'Gjakovë',
                'dose'                    => '0.5ml SC',
                'image'                   => null,
            ],
            [
                'code'                    => 'VAR',
                'name'                    => 'Varicella Vaccine',
                'protectsAgainst'         => 'Chickenpox',
                'recommended_age_months'  => '12',
                'description'             => 'Live-attenuated vaccine to prevent varicella (chickenpox).',
                'vaccination_municipality'=> 'Vushtrri',
                'dose'                    => '0.5ml SC',
                'image'                   => null,
            ],
            [
                'code'                    => 'HepA',
                'name'                    => 'Hepatitis A Vaccine',
                'protectsAgainst'         => 'Hepatitis A',
                'recommended_age_months'  => '12',
                'description'             => 'Inactivated vaccine protecting against Hepatitis A virus.',
                'vaccination_municipality'=> 'Podujevë',
                'dose'                    => '0.5ml IM',
                'image'                   => null,
            ],
            [
                'code'                    => 'HPV',
                'name'                    => 'HPV Vaccine',
                'protectsAgainst'         => 'Human Papillomavirus',
                'recommended_age_months'  => '132',
                'description'             => 'Protects against HPV strains that cause cervical cancer and genital warts.',
                'vaccination_municipality'=> 'Suharekë',
                'dose'                    => '0.5ml IM',
                'image'                   => null,
            ],
        ];

        foreach ($vaccines as $vaccine) {
            Vaccine::create($vaccine);
        }
    }
}
