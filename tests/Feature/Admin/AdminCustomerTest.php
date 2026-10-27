<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Jobs\DeleteUserDataJob;
use App\Mail\AdminCreatedAccountMail;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Queue;
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

        $this->assertDatabaseMissing('users', ['id' => $customer->id]);
    }

    public function test_super_admin_can_create_admin_account(): void
    {
        $superAdmin = User::factory()->admin()->create();
        $superAdmin->forceFill(['role' => UserRole::SuperAdmin])->save();

        $this->actingAs($superAdmin)
            ->post(route('admin.korisnici.store'), [
                'name'                  => 'Novi Admin',
                'email'                 => 'novi.admin@example.com',
                'password'              => 'Password1234',
                'password_confirmation' => 'Password1234',
                'role'                  => 'admin',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame(UserRole::Admin, User::where('email', 'novi.admin@example.com')->first()->role);
    }

    public function test_created_account_email_contains_set_password_link_not_password(): void
    {
        Mail::fake();

        $this->actingAs($this->admin())
            ->post(route('admin.korisnici.store'), [
                'name'                  => 'Novi Korisnik',
                'email'                 => 'novi@example.com',
                'password'              => 'TajnaLozinka123',
                'password_confirmation' => 'TajnaLozinka123',
                'role'                  => 'customer',
            ])
            ->assertSessionHasNoErrors();

        Mail::assertQueued(AdminCreatedAccountMail::class, function (AdminCreatedAccountMail $mail) {
            $this->assertStringNotContainsString('TajnaLozinka123', $mail->render());
            $this->assertStringContainsString('/resetovanje-lozinke/', $mail->setPasswordUrl);

            $token = basename(parse_url($mail->setPasswordUrl, PHP_URL_PATH));
            $this->assertTrue(Password::tokenExists(User::where('email', 'novi@example.com')->first(), $token));

            return true;
        });
    }

    public function test_deleted_customer_is_disabled_before_the_purge_job_runs(): void
    {
        Queue::fake();
        $customer = $this->customer();

        $this->actingAs($this->admin())
            ->delete(route('admin.korisnici.destroy', $customer))
            ->assertRedirect(route('admin.korisnici.index'));

        $this->assertSoftDeleted($customer);
        Queue::assertPushed(DeleteUserDataJob::class);
    }
}
