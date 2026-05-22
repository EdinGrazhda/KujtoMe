<?php

namespace App\Providers;

use App\Models\Children;
use App\Models\Confirmation;
use App\Models\doctor;
use App\Models\Parents;
use App\Models\Vaccine;
use App\Policies\ChildrenPolicy;
use App\Policies\ConfirmationPolicy;
use App\Policies\DoctorPolicy;
use App\Policies\ParentsPolicy;
use App\Policies\VaccinePolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
  
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        $this->configureDefaults();
    }

    protected function registerPolicies(): void
    {
        Gate::policy(Children::class, ChildrenPolicy::class);
        Gate::policy(doctor::class, DoctorPolicy::class);
        Gate::policy(Parents::class, ParentsPolicy::class);
        Gate::policy(Vaccine::class, VaccinePolicy::class);
        Gate::policy(Confirmation::class, ConfirmationPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
