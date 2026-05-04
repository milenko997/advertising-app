@component('mail::message')
# Recenzija obrisana

Poštovani {{ $displayName }},

Korisnik **{{ $reviewerName }}** je obrisao/la svoju recenziju sa Vašeg profila.

@component('mail::button', ['url' => config('app.url') . '/profil'])
Moj profil
@endcomponent

Srdačan pozdrav,
Tim Transporteri
@endcomponent
