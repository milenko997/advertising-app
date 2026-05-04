@component('mail::message')
# Vaš oglas je uklonjen

Poštovani {{ $displayName }},

Obaveštavamo vas da je vaš oglas **{{ $adTitle }}** uklonjen od strane administratora platforme Transporteri zbog kršenja pravila korišćenja.

Preostale oglase možete pregledati na stranici Moji oglasi.

@component('mail::button', ['url' => config('app.url') . '/moji-oglasi'])
Moji oglasi
@endcomponent

Ukoliko smatrate da je ovo greška, kontaktirajte nas putem stranice za kontakt.

Srdačan pozdrav,
Tim Transporteri
@endcomponent
