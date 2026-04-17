<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCustomerSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_admin_cannot_delete_another_admin(): void
    {
        $admin       = User::factory()->admin()->create();
        $otherAdmin  = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->delete(route('admin.korisnici.destroy', $otherAdmin))
            ->assertForbidden();

        $this->assertDatabaseHas('users', ['id' => $otherAdmin->id, 'deleted_at' => null]);
    }

    public function test_admin_can_delete_customer(): void
    {
        $admin    = User::factory()->admin()->create();
        $customer = User::factory()->customer()->create();

        $this->actingAs($admin)
            ->delete(route('admin.korisnici.destroy', $customer))
            ->assertRedirect(route('admin.korisnici.index'));

        $this->assertSoftDeleted('users', ['id' => $customer->id]);
    }
}
