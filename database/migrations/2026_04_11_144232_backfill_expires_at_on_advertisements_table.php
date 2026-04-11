<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class BackfillExpiresAtOnAdvertisementsTable extends Migration
{
    public function up()
    {
        // Set expires_at = created_at + 60 days for all ads that don't have it yet
        DB::statement("
            UPDATE advertisements
            SET expires_at = datetime(created_at, '+60 days')
            WHERE expires_at IS NULL
        ");
    }

    public function down()
    {
        //
    }
}
