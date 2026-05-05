@component('mail::message')
# Lozinka je uspešno promenjena

Zdravo **{{ $displayName }}**,

Lozinka Vašeg naloga na platformi Transporteri je upravo uspešno promenjena.

@component('mail::panel')
**Niste Vi izvršili ovu promenu?**
Ukoliko niste Vi inicirali promenu lozinke, odmah nas kontaktirajte — Vaš nalog može biti kompromitovan.
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/profil'])
Moj nalog
@endcomponent

Za hitne slučajeve, dostupni smo na:
**info@transporteri.rs** · **+381 69 583 3352**

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
