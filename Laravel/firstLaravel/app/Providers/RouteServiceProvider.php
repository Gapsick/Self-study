<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider {
    public const HOME = '/home';

    public function boot() {
        parent::boot();
    }
}
