@component('mail::message')
# Nalog je kreiran za Vas

Zdravo **{{ $displayName }}**,

Administrator platforme Transporteri kreirao je nalog za Vas. Možete se odmah prijaviti koristeći sledeće podatke:

@component('mail::panel')
**Email:** {{ $email }}
**Lozinka:** {{ $password }}
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/prijava'])
Prijavite se
@endcomponent

Preporučujemo da **odmah promenite lozinku** nakon prve prijave — idite na Podešavanja profila.

Ukoliko imate pitanja, dostupni smo na:
**info@transporteri.rs** · **+381 69 583 3352**

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
