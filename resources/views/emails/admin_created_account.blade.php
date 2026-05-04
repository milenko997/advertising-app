@component('mail::message')
# Nalog je kreiran

Poštovani {{ $displayName }},

Administrator platforme Transporteri kreirao je nalog za Vas. Možete se prijaviti koristeći sledeće podatke:

- **Email:** {{ $email }}
- **Lozinka:** {{ $password }}

@component('mail::button', ['url' => config('app.url') . '/prijava'])
Prijavite se
@endcomponent

Preporučujemo da promenite lozinku nakon prve prijave.

Ukoliko imate pitanja, kontaktirajte nas:

- Email: [info@transporteri.rs](mailto:info@transporteri.rs)
- Telefon: [+381 69 583 3352](tel:+38169583352)

Srdačan pozdrav,
Tim Transporteri
@endcomponent
