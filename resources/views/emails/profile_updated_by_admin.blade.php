@component('mail::message')
# Profil izmenjen od strane administratora

Poštovani {{ $displayName }},

Administrator je izvršio izmene na Vašem profilu na platformi Transporteri.

@component('mail::button', ['url' => config('app.url') . '/profil'])
Pogledajte profil
@endcomponent

Ukoliko imate pitanja ili smatrate da je ovo greška, kontaktirajte nas:

- Email: [info@transporteri.rs](mailto:info@transporteri.rs)
- Telefon: [+381 69 583 3352](tel:+38169583352)

Srdačan pozdrav,
Tim Transporteri
@endcomponent
