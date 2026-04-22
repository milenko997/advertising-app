<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(\App\Services\ImageService::class);
        $this->app->singleton(\App\Services\SlugService::class);
    }

    public function boot()
    {
        Blade::directive('vite', function ($expression) {
            return "<?php echo \\App\\Support\\Vite::tags($expression); ?>";
        });

        Password::defaults(function () {
            return Password::min(10)->mixedCase()->numbers()->uncompromised();
        });
    }
}
