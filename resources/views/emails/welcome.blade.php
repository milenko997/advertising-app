@component('mail::message')
# Dobrodošli na Transporteri!

Zdravo **{{ $displayName }}**,

Vaš nalog je uspešno kreiran. Sada ste deo najveće platforme za transport i logistiku u Srbiji — možete odmah početi sa postavljanjem oglasa i pronalaženjem poslovnih partnera.

@component('mail::panel')
**Šta možete raditi:**
- Postavljati oglase za vozila i transportne usluge
- Pregledati hiljade aktivnih oglasa
- Čuvati omiljene oglase i kontaktirati oglašivače
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/postavi-oglas'])
Postavi prvi oglas
@endcomponent

Ukoliko imate pitanja, tu smo:
**info@transporteri.rs** · **+381 69 583 3352**

Srdačan pozdrav,
**Tim Transporteri**
@endcomponent
