<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_role_is_correctly_identified(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isCustomer());
        $this->assertEquals(UserRole::Admin, $admin->role);
    }

    public function test_customer_role_is_correctly_identified(): void
    {
        $customer = User::factory()->customer()->create();

        $this->assertFalse($customer->isAdmin());
        $this->assertTrue($customer->isCustomer());
        $this->assertEquals(UserRole::Customer, $customer->role);
    }

    public function test_user_slug_is_auto_generated_on_create(): void
    {
        $user = User::factory()->create(['name' => 'John Doe']);

        $this->assertNotNull($user->slug);
        $this->assertEquals('john-doe', $user->slug);
    }

    public function test_user_slug_is_unique(): void
    {
        User::factory()->create(['name' => 'John Doe']);
        $second = User::factory()->create(['name' => 'John Doe']);

        $this->assertEquals('john-doe-1', $second->slug);
    }

    public function test_user_slug_updates_when_name_changes(): void
    {
        $user = User::factory()->create(['name' => 'Old Name']);
        $user->update(['name' => 'New Name']);

        $this->assertEquals('new-name', $user->fresh()->slug);
    }
}
