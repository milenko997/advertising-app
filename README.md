<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

Komande za pokretanje projekta nakon kloniranja

composer install

npm install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan db:seed -- opciono, napravljeni su seeder-i za oglase, Customer user-e i kategorije

Napomena za seedere: slika oglasa se nece prikazivati jer je storage folder prazan, ali rucno ubacivanje slika ce savrseno raditi

php artisan storage:link -- opciono, pravljenje linkova ka slikama u storage folderu

php artisan config:cache -- opciono, brisanje cache

npm run dev

php artisan serve

pravljenje Admin usera (super admin)

php artisan tinker

\App\Models\User::create([
    'name' => 'Super Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('12345678'),
    'role' => 'admin',
]);
