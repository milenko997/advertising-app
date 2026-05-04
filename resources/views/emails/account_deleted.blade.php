@component('mail::message')
# Nalog je trajno obrisan

Poštovani {{ $displayName }},

Potvrđujemo da je vaš nalog na platformi Transporteri trajno obrisan zajedno sa svim vašim oglasima i podacima.

Ako se predomislite, uvek možete napraviti novi nalog.

@component('mail::button', ['url' => config('app.url') . '/registracija'])
Registrujte se ponovo
@endcomponent

Hvala što ste koristili Transporteri.

Srdačan pozdrav,
Tim Transporteri
@endcomponent
