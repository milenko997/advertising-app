<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTransportFieldsToAdvertisementsTable extends Migration
{
    public function up()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn('condition');
            $table->string('price')->nullable()->change();
            $table->string('vehicle_type')->default('')->after('description');
            $table->string('payload')->nullable()->after('vehicle_type');
            $table->string('route')->nullable()->after('payload');
            $table->string('availability')->default('available')->after('route');
        });
    }

    public function down()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn(['vehicle_type', 'payload', 'route', 'availability']);
            $table->string('price')->nullable(false)->change();
            $table->string('condition')->default('used')->after('price');
        });
    }
}
