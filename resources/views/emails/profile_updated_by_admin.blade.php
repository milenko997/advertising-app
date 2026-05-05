@component('mail::message')
# Profil je izmenjen od strane administratora

Zdravo **{{ $displayName }}**,

Administrator platforme Transporteri je izvršio izmene na Vašem profilu.

@component('mail::button', ['url' => config('app.url') . '/profil'])
Pogledajte profil
@endcomponent

@component('mail::panel')
Ukoliko niste očekivali ovu izmenu ili smatrate da je došlo do greške, odmah nas kontaktirajte:

**info@transporteri.rs** · **+381 69 583 3352**
@endcomponent

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
