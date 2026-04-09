<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddTransportFieldsToAdvertisementsTable extends Migration
{
    public function up()
    {
        // SQLite doesn't support DROP COLUMN without doctrine/dbal.
        // We recreate the table manually to remove `condition` and add transport fields.

        DB::statement('CREATE TABLE "advertisements_new" (
            "id" integer not null primary key autoincrement,
            "user_id" integer not null,
            "title" varchar not null,
            "slug" varchar not null,
            "description" text not null,
            "price" varchar null,
            "vehicle_type" varchar not null default "",
            "payload" varchar null,
            "route" varchar null,
            "availability" varchar not null default "available",
            "image" varchar null,
            "phone" varchar not null,
            "location" varchar not null,
            "category_id" integer not null,
            "created_at" datetime null,
            "updated_at" datetime null,
            "deleted_at" datetime null,
            foreign key("user_id") references "users"("id") on delete cascade,
            foreign key("category_id") references "categories"("id") on delete cascade
        )');

        DB::statement('INSERT INTO "advertisements_new"
            ("id","user_id","title","slug","description","price","image","phone","location","category_id","created_at","updated_at","deleted_at")
            SELECT "id","user_id","title","slug","description","price","image","phone","location","category_id","created_at","updated_at","deleted_at"
            FROM "advertisements"');

        DB::statement('DROP TABLE "advertisements"');
        DB::statement('ALTER TABLE "advertisements_new" RENAME TO "advertisements"');
        DB::statement('CREATE UNIQUE INDEX "advertisements_slug_unique" ON "advertisements" ("slug")');
    }

    public function down()
    {
        DB::statement('CREATE TABLE "advertisements_old" (
            "id" integer not null primary key autoincrement,
            "user_id" integer not null,
            "title" varchar not null,
            "slug" varchar not null,
            "description" text not null,
            "price" varchar not null,
            "condition" varchar not null default "used",
            "image" varchar null,
            "phone" varchar not null,
            "location" varchar not null,
            "category_id" integer not null,
            "created_at" datetime null,
            "updated_at" datetime null,
            "deleted_at" datetime null,
            foreign key("user_id") references "users"("id") on delete cascade,
            foreign key("category_id") references "categories"("id") on delete cascade
        )');

        DB::statement('INSERT INTO "advertisements_old"
            ("id","user_id","title","slug","description","price","image","phone","location","category_id","created_at","updated_at","deleted_at")
            SELECT "id","user_id","title","slug","description",COALESCE("price",""),"image","phone","location","category_id","created_at","updated_at","deleted_at"
            FROM "advertisements"');

        DB::statement('DROP TABLE "advertisements"');
        DB::statement('ALTER TABLE "advertisements_old" RENAME TO "advertisements"');
        DB::statement('CREATE UNIQUE INDEX "advertisements_slug_unique" ON "advertisements" ("slug")');
    }
}
