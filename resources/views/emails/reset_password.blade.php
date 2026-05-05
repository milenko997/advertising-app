@component('mail::message')
# Resetovanje lozinke

Zdravo **{{ $displayName }}**,

Primili smo zahtev za resetovanje lozinke Vašeg naloga. Kliknite na dugme ispod da biste postavili novu lozinku.

@component('mail::button', ['url' => $resetUrl])
Resetujte lozinku
@endcomponent

@component('mail::panel')
Ovaj link važi **60 minuta** od trenutka slanja. Nakon isteka, potrebno je podneti novi zahtev.

Ukoliko niste Vi zatražili resetovanje lozinke, možete ignorisati ovaj email — Vaš nalog ostaje bezbedan.
@endcomponent

Srdačan pozdrav,
**Tim Transporteri**

@component('mail::subcopy')
Ukoliko ne možete kliknuti na dugme "Resetujte lozinku", kopirajte i nalepite sledeći URL u Vaš pretraživač: [{{ $resetUrl }}]({{ $resetUrl }})
@endcomponent
@endcomponent
