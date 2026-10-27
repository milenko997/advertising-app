@component('mail::message')
# Oglas je obnovljen

Zdravo **{{ $displayName }}**,

Administrator platforme Transporteri je obnovio Vaš oglas **"{{ $adTitle }}"**. Oglas je ponovo aktivan i biće vidljiv do **{{ $expiresAt }}**.

@component('mail::button', ['url' => config('app.url') . '/oglas/' . $adSlug])
Pogledajte oglas
@endcomponent

Ukoliko imate pitanja, slobodno nas kontaktirajte:

**info@transporteri.rs** · **+381 69 583 3352**

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
