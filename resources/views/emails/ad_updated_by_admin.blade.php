@component('mail::message')
# Oglas izmenjen od strane administratora

Poštovani {{ $displayName }},

Administrator je izvršio izmene na Vašem oglasu **"{{ $adTitle }}"**.

@component('mail::button', ['url' => config('app.url') . '/oglas/' . $adSlug])
Pogledajte oglas
@endcomponent

Ukoliko imate pitanja, kontaktirajte nas:

- Email: [info@transporteri.rs](mailto:info@transporteri.rs)
- Telefon: [+381 69 583 3352](tel:+38169583352)

Srdačan pozdrav,
Tim Transporteri
@endcomponent
