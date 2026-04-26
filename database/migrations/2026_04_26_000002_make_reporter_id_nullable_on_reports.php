<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('PRAGMA foreign_keys=OFF');

        DB::statement('CREATE TABLE reports_new (
            id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
            advertisement_id integer NOT NULL,
            reporter_id integer NULL,
            type varchar NOT NULL CHECK(type IN ("wrong_category","duplicate_spam","against_rules","ignore_user")),
            resolved tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime NULL,
            updated_at datetime NULL,
            FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE
        )');

        DB::statement('INSERT INTO reports_new SELECT * FROM reports');
        DB::statement('DROP TABLE reports');
        DB::statement('ALTER TABLE reports_new RENAME TO reports');

        DB::statement('CREATE UNIQUE INDEX reports_advertisement_id_reporter_id_type_unique ON reports(advertisement_id, reporter_id, type)');
        DB::statement('CREATE INDEX reports_resolved_index ON reports(resolved)');

        DB::statement('PRAGMA foreign_keys=ON');
    }

    public function down(): void
    {
        // Intentionally not reversible — downgrading would lose anonymous reports
    }
};
