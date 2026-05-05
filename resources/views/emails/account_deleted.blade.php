@component('mail::message')
# Nalog je trajno obrisan

Zdravo **{{ $displayName }}**,

Vaš nalog na platformi Transporteri je trajno obrisan zajedno sa svim Vašim oglasima, slikama i ličnim podacima. Ova akcija je nepovratna.

Ako se predomislite u budućnosti, uvek možete napraviti novi nalog — registracija je besplatna i traje manje od minut.

@component('mail::button', ['url' => config('app.url') . '/registracija'])
Registrujte se ponovo
@endcomponent

Hvala što ste koristili Transporteri. Nadamo se da ćemo Vas ponovo videti.

Srdačan pozdrav,
**Tim Transporteri**
@endcomponent
