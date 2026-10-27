<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Process;

class DumpDatabase extends Command
{
    protected $signature   = 'backup:dump-database {path : File to write the dump to}';
    protected $description = 'Write a consistent copy of the database to a file (used by deploy/backup.sh)';

    public function handle(): int
    {
        $path   = $this->argument('path');
        $config = config('database.connections.' . config('database.default'));

        @unlink($path);

        match ($config['driver']) {
            // Consistent copy of a live database, without the sqlite3 CLI
            'sqlite' => DB::statement('VACUUM INTO ?', [$path]),
            'mysql', 'mariadb' => $this->mysqldump($config, $path),
            default => throw new \RuntimeException("Unsupported database driver: {$config['driver']}"),
        };

        if (!is_file($path) || filesize($path) === 0) {
            $this->error("Database dump {$path} is empty.");
            return self::FAILURE;
        }

        $this->info("Database dumped to {$path}.");
        return self::SUCCESS;
    }

    private function mysqldump(array $config, string $path): void
    {
        $command = [
            'mysqldump',
            '--single-transaction', // consistent snapshot without locking InnoDB tables
            '--quick',
            '--routines',
            '--no-tablespaces',     // needs no PROCESS privilege
            '--default-character-set=utf8mb4',
            '--user=' . $config['username'],
            '--result-file=' . $path,
        ];

        if (!empty($config['unix_socket'])) {
            $command[] = '--socket=' . $config['unix_socket'];
        } else {
            $command[] = '--host=' . $config['host'];
            $command[] = '--port=' . $config['port'];
        }

        $command[] = $config['database'];

        // Password through the environment so it never shows up in the process list
        Process::env(['MYSQL_PWD' => (string) $config['password']])
            ->timeout(3600)
            ->run($command)
            ->throw();
    }
}
