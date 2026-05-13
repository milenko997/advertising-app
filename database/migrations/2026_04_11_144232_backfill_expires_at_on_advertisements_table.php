<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class BackfillExpiresAtOnAdvertisementsTable extends Migration
{
    public function up()
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement("UPDATE advertisements SET expires_at = datetime(created_at, '+60 days') WHERE expires_at IS NULL");
        } else {
            DB::statement("UPDATE advertisements SET expires_at = DATE_ADD(created_at, INTERVAL 60 DAY) WHERE expires_at IS NULL");
        }
    }

    public function down()
    {
        //
    }
}
