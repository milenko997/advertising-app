@component('mail::message')
# Vaš oglas ističe za 7 dana

Poštovani {{ $displayName }},

Obaveštavamo vas da vaš oglas **{{ $adTitle }}** ističe **{{ $expiresAt }}**.

Nakon isteka oglas neće biti vidljiv posjetiocima platforme. Obnovite ga na vreme kako bi ostao aktivan.

@component('mail::button', ['url' => config('app.url') . '/oglas/' . $adSlug])
Pogledaj oglas
@endcomponent

Obnovu možete izvršiti sa stranice **Moji oglasi**.

Srdačan pozdrav,
Tim Transporteri
@endcomponent
