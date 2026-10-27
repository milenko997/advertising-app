<?php

namespace App\Exceptions;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

/**
 * Mails reported exceptions to ERROR_MAIL_TO, at most once an hour per kind of error,
 * so a broken page hit by every visitor doesn't flood the inbox.
 */
class ErrorMailer
{
    public static function send(Throwable $e): void
    {
        $to = config('app.error_mail');
        if (!$to) {
            return;
        }

        $signature = 'error_mail:' . sha1(get_class($e) . $e->getFile() . $e->getLine());
        if (!Cache::add($signature, true, now()->addHour())) {
            return;
        }

        $request = app()->runningInConsole() ? null : request();
        $body = implode("\n", array_filter([
            get_class($e) . ': ' . $e->getMessage(),
            $e->getFile() . ':' . $e->getLine(),
            $request ? $request->method() . ' ' . $request->fullUrl() : 'console: ' . implode(' ', $_SERVER['argv'] ?? []),
            $request?->user() ? 'Korisnik #' . $request->user()->id : null,
            'Vreme: ' . now()->format('d.m.Y H:i:s'),
            'Ista greška se ne šalje ponovo narednih sat vremena. Detalji su u storage/logs/laravel.log.',
            '',
            Str::limit($e->getTraceAsString(), 4000),
        ], fn ($line) => $line !== null));

        try {
            // Sent right away, not queued: the queue itself may be what is broken
            Mail::raw($body, fn ($m) => $m
                ->to($to)
                ->subject('[' . config('app.name') . '] Greška: ' . Str::limit(class_basename($e) . ': ' . $e->getMessage(), 120)));
        } catch (Throwable) {
            // Mail is down too; the error is still in the log
        }
    }
}
