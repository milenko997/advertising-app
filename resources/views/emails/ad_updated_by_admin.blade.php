@component('mail::message')
# Oglas je izmenjen od strane administratora

Zdravo **{{ $displayName }}**,

Administrator platforme Transporteri je izvršio izmene na Vašem oglasu **"{{ $adTitle }}"**.

@component('mail::button', ['url' => config('app.url') . '/oglas/' . $adSlug])
Pogledajte oglas
@endcomponent

Ukoliko smatrate da izmene nisu opravdane ili imate pitanja, slobodno nas kontaktirajte:

**info@transporteri.rs** · **+381 69 583 3352**

Srdačan pozdrav,
**Tim Transporteri**
@endcomponent
