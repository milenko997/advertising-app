<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class BackfillExpiresAtOnAdvertisementsTable extends Migration
{
    public function up()
    {
        DB::statement("
            UPDATE advertisements
            SET expires_at = DATE_ADD(created_at, INTERVAL 60 DAY)
            WHERE expires_at IS NULL
        ");
    }

    public function down()
    {
        //
    }
}
