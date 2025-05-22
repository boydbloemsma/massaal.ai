<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureCommands();
        $this->configureModels();
        $this->configureUrl();
        $this->configureRateLimiters();
        $this->configureGates();
        $this->handleNotes();
    }

    private function handleNotes(): void
    {
        Inertia::share('notes', function () {
            $user = Auth::user();

            if (!$user) {
                return [];
            }

            return $user
                ->notes()
                ->latest()
                ->get();
        });
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands(
            $this->app->isProduction(),
        );
    }

    private function configureModels(): void
    {
        Model::shouldBeStrict();

        Model::unguard();
    }

    private function configureUrl(): void
    {
        if ($this->app->isLocal()) {
            return;
        }

        URL::forceScheme('https');
    }

    private function configureRateLimiters(): void
    {
    }

    private function configureGates(): void
    {
    }
}
