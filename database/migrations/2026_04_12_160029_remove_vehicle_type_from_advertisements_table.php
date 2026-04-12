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
        // SQLite doesn't support dropColumn without doctrine/dbal — recreate via raw SQL
        DB::statement('CREATE TABLE advertisements_new AS SELECT id, user_id, category_id, title, slug, description, payload, availability, price, phone, location, image, views, is_pinned, expires_at, deleted_at, created_at, updated_at FROM advertisements');
        DB::statement('DROP TABLE advertisements');
        DB::statement('ALTER TABLE advertisements_new RENAME TO advertisements');
    }

    public function down()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->string('vehicle_type')->nullable()->after('description');
        });
    }
}
