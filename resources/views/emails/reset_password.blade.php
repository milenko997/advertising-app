@component('mail::message')
# Resetovanje lozinke

Poštovani {{ $displayName }},

Primili smo zahtev za resetovanje lozinke Vašeg naloga. Kliknite na dugme ispod da biste postavili novu lozinku.

@component('mail::button', ['url' => $resetUrl])
Resetujte lozinku
@endcomponent

Ovaj link će isteći za 60 minuta.

Ukoliko niste Vi zatražili resetovanje lozinke, možete ignorisati ovaj email.

Srdačan pozdrav,
Tim Transporteri

@component('mail::subcopy')
Ukoliko ne možete kliknuti na dugme "Resetujte lozinku", kopirajte i nalepite sledeći URL u Vaš pretraživač: [{{ $resetUrl }}]({{ $resetUrl }})
@endcomponent
@endcomponent
