<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Process;
use Tests\TestCase;

class DumpDatabaseTest extends TestCase
{
    private string $path;

    protected function setUp(): void
    {
        parent::setUp();
        $this->path = sys_get_temp_dir() . '/dump-test-' . uniqid() . '.sql';
    }

    protected function tearDown(): void
    {
        @unlink($this->path);
        parent::tearDown();
    }

    public function test_sqlite_database_is_copied(): void
    {
        // No RefreshDatabase: VACUUM INTO can't run inside its wrapping transaction
        $this->artisan('migrate');
        $user = User::factory()->create();

        $this->artisan('backup:dump-database', ['path' => $this->path])->assertSuccessful();

        $copy = new \PDO('sqlite:' . $this->path);
        $this->assertSame($user->email, $copy->query('select email from users')->fetchColumn());
    }

    public function test_mysql_is_dumped_with_password_from_the_environment(): void
    {
        config([
            'database.default' => 'mysql',
            'database.connections.mysql.username' => 'app',
            'database.connections.mysql.password' => 's3cret',
            'database.connections.mysql.database' => 'transporteri',
        ]);
        Process::fake(function ($process) {
            file_put_contents($this->path, '-- dump');
            return Process::result();
        });

        $this->artisan('backup:dump-database', ['path' => $this->path])->assertSuccessful();

        Process::assertRan(fn ($process) => $process->environment['MYSQL_PWD'] === 's3cret'
            && in_array('transporteri', $process->command, true)
            && !in_array('s3cret', $process->command, true));
    }
}
