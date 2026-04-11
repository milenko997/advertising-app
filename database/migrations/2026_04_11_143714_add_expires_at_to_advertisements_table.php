<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddExpiresAtToAdvertisementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('is_pinned');
        });
    }

    public function down()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
}
