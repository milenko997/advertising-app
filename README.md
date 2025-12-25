<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

Commands to Run the Project After Cloning

Install PHP dependencies:

composer install

Install Node.js dependencies:

npm install

Copy the example environment file:

cp .env.example .env

Generate the application key:

php artisan key:generate

Create the SQLite database file:

touch database/database.sqlite

Run migrations:

php artisan migrate

Run seeders (optional):

php artisan db:seed

Seeders create ads, Customer users, and categories.
Note: Ad images will not appear because the storage folder is empty. You can add images manually and it will work perfectly.

Create symbolic links for storage (optional):

php artisan storage:link

Clear and cache config (optional):

php artisan config:cache

Build frontend assets:

npm run dev

Start the Laravel development server:

php artisan serve

Creating a Super Admin User

Open Tinker:

php artisan tinker

Run the following command in Tinker:

\App\Models\User::create([
    'name' => 'Super Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('12345678'),
    'role' => 'admin',
]);


For the lazy 🙂

composer install && npm install && cp .env.example .env && php artisan key:generate && touch database/database.sqlite && php artisan migrate --seed && mkdir -p public/storage/ads && php artisan storage:link && php artisan config:clear && php artisan cache:clear && npm run dev && php artisan serve
