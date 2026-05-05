@component('mail::message')
# Vaš oglas uskoro ističe

Zdravo **{{ $displayName }}**,

Vaš oglas **"{{ $adTitle }}"** ističe **{{ $expiresAt }}**. Nakon isteka oglas neće biti vidljiv posetiocima platforme.

@component('mail::button', ['url' => config('app.url') . '/oglas/' . $adSlug])
Pogledajte oglas
@endcomponent

Obnovu možete izvršiti sa stranice **Moji oglasi** — oglas ostaje aktivan još 60 dana od momenta obnavljanja.

Srdačan pozdrav,

**Tim Transporteri**
@endcomponent
