<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCustomerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function customer(): User
    {
        return User::factory()->customer()->create();
    }

    // ── Access control ────────────────────────────────────────────────────────

    public function test_guest_cannot_access_admin_customers(): void
    {
        $this->get(route('admin.korisnici.index'))->assertRedirect(route('login'));
    }

    public function test_customer_cannot_access_admin_customers(): void
    {
        $this->actingAs($this->customer())
            ->get(route('admin.korisnici.index'))
            ->assertForbidden();
    }

    public function test_admin_can_view_customer_list(): void
    {
        $customer = $this->customer();

        $this->actingAs($this->admin())
            ->get(route('admin.korisnici.index'))
            ->assertOk()
            ->assertSee($customer->name);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public function test_admin_can_update_customer(): void
    {
        $admin    = $this->admin();
        $customer = $this->customer();

        $this->actingAs($admin)
            ->put(route('admin.korisnici.update', $customer), [
                'name'  => 'Updated Name',
                'email' => 'updated@example.com',
                'role'  => 'customer',
            ])
            ->assertRedirect(route('admin.korisnici.index'));

        $this->assertDatabaseHas('users', ['id' => $customer->id, 'name' => 'Updated Name']);
    }

    public function test_update_does_not_allow_arbitrary_fields(): void
    {
        $admin    = $this->admin();
        $customer = $this->customer();
        $originalPassword = $customer->password;

        $this->actingAs($admin)
            ->put(route('admin.korisnici.update', $customer), [
                'name'     => 'Updated Name',
                'email'    => $customer->email,
                'role'     => 'customer',
                'password' => 'hacked_password',
            ])
            ->assertRedirect();

        $customer->refresh();
        $this->assertEquals($originalPassword, $customer->password);
    }

    public function test_update_role_must_be_valid(): void
    {
        $admin    = $this->admin();
        $customer = $this->customer();

        $this->actingAs($admin)
            ->put(route('admin.korisnici.update', $customer), [
                'name'  => 'Name',
                'email' => $customer->email,
                'role'  => 'superuser',
            ])
            ->assertSessionHasErrors('role');
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    public function test_admin_can_delete_customer(): void
    {
        $admin    = $this->admin();
        $customer = $this->customer();

        $this->actingAs($admin)
            ->delete(route('admin.korisnici.destroy', $customer))
            ->assertRedirect(route('admin.korisnici.index'));

        $this->assertSoftDeleted('users', ['id' => $customer->id]);
    }
}
