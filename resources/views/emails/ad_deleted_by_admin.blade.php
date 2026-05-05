@component('mail::message')
# Vaš oglas je uklonjen

Zdravo **{{ $displayName }}**,

Obaveštavamo Vas da je Vaš oglas **"{{ $adTitle }}"** uklonjen od strane administratora platforme Transporteri zbog kršenja pravila korišćenja.

@component('mail::panel')
Ukoliko smatrate da je ovo greška ili želite da razjasnite razloge uklanjanja, kontaktirajte nas:

**info@transporteri.rs** · **+381 69 583 3352**
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/moji-oglasi'])
Moji oglasi
@endcomponent

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
