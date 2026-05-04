@component('mail::message')
# Dobrodošli na Transporteri!

Poštovani {{ $displayName }},

Vaš nalog je uspešno kreiran. Sada možete postavljati oglase i koristiti sve pogodnosti platforme za transport i logistiku.

@component('mail::button', ['url' => config('app.url') . '/postavi-oglas'])
Postavi prvi oglas
@endcomponent

Ukoliko imate pitanja, slobodno nas kontaktirajte putem stranice za kontakt.

Srdačan pozdrav,
Tim Transporteri
@endcomponent
