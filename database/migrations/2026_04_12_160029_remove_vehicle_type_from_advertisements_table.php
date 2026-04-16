<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RemoveVehicleTypeFromAdvertisementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // SQLite doesn't support dropColumn without recreating the table
        DB::statement('CREATE TABLE "advertisements_new" (
            "id" integer not null primary key autoincrement,
            "user_id" integer not null,
            "category_id" integer not null,
            "title" varchar not null,
            "slug" varchar not null,
            "description" text not null,
            "payload" varchar null,
            "availability" varchar not null default "available",
            "price" varchar null,
            "phone" varchar not null,
            "location" varchar not null,
            "image" varchar null,
            "views" integer not null default 0,
            "is_pinned" integer not null default 0,
            "expires_at" datetime null,
            "deleted_at" datetime null,
            "created_at" datetime null,
            "updated_at" datetime null,
            foreign key("user_id") references "users"("id") on delete cascade,
            foreign key("category_id") references "categories"("id") on delete cascade
        )');
        DB::statement('INSERT INTO "advertisements_new"
            (id, user_id, category_id, title, slug, description, payload, availability, price, phone, location, image, views, is_pinned, expires_at, deleted_at, created_at, updated_at)
            SELECT id, user_id, category_id, title, slug, description, payload, availability, price, phone, location, image, views, is_pinned, expires_at, deleted_at, created_at, updated_at
            FROM advertisements');
        DB::statement('DROP TABLE advertisements');
        DB::statement('ALTER TABLE advertisements_new RENAME TO advertisements');
        DB::statement('CREATE UNIQUE INDEX "advertisements_slug_unique" ON "advertisements" ("slug")');
    }

    public function down()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->string('vehicle_type')->nullable()->after('description');
        });
    }
}
