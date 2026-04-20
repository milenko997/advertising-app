<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPinnedAtToAdvertisementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->timestamp('pinned_at')->nullable()->after('is_pinned');
            $table->timestamp('pinned_category_at')->nullable()->after('is_pinned_category');
        });
    }

    public function down()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn(['pinned_at', 'pinned_category_at']);
        });
    }
}
