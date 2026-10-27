<?php

namespace Tests\Feature;

use Tests\TestCase;

class ErrorMailTest extends TestCase
{
    private function sentMessages()
    {
        return app('mailer')->getSymfonyTransport()->messages();
    }

    protected function setUp(): void
    {
        parent::setUp();
        config(['mail.default' => 'array', 'mail.from.address' => 'no-reply@example.com']);
    }

    public function test_error_is_mailed_once_per_hour(): void
    {
        config(['app.error_mail' => 'admin@example.com']);

        // Same place in the code, like one broken page hit by many visitors
        foreach (range(1, 3) as $i) {
            report(new \RuntimeException('Baza nije dostupna'));
        }

        $this->assertCount(1, $this->sentMessages());
        $email = $this->sentMessages()->first()->getOriginalMessage();
        $this->assertSame('admin@example.com', $email->getTo()[0]->getAddress());
        $this->assertStringContainsString('Baza nije dostupna', $email->getSubject());
    }

    public function test_nothing_is_mailed_without_an_address(): void
    {
        config(['app.error_mail' => null]);

        report(new \RuntimeException('Greška'));

        $this->assertCount(0, $this->sentMessages());
    }
}
