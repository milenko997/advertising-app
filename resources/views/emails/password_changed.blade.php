@component('mail::message')
# Lozinka je promenjena

Poštovani {{ $displayName }},

Lozinka Vašeg naloga na platformi Transporteri je uspešno promenjena.

Ukoliko niste Vi izvršili ovu promenu, odmah nas kontaktirajte:

- Email: [info@transporteri.rs](mailto:info@transporteri.rs)
- Telefon: [+381 69 583 3352](tel:+38169583352)

@component('mail::button', ['url' => config('app.url') . '/profil'])
Moj nalog
@endcomponent

Srdačan pozdrav,
Tim Transporteri
@endcomponent
