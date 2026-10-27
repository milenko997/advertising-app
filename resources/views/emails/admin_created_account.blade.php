@component('mail::message')
# Nalog je kreiran za Vas

Zdravo **{{ $displayName }}**,

Administrator platforme Transporteri kreirao je nalog za Vas sa email adresom **{{ $email }}**. Kliknite na dugme ispod da postavite svoju lozinku:

@component('mail::button', ['url' => $setPasswordUrl])
Postavite lozinku
@endcomponent

Link važi {{ config('auth.passwords.users.expire') }} minuta. Ako je istekao, lozinku možete postaviti preko opcije „Zaboravili ste lozinku?“ na stranici za prijavu.

Ukoliko imate pitanja, dostupni smo na:
**info@transporteri.rs** · **+381 69 583 3352**

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
