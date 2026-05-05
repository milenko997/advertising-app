@component('mail::message')
# Nova poruka sa kontakt forme

@component('mail::panel')
**Od:** {{ $senderName }} ({{ $senderEmail }})
**Predmet:** {{ $messageSubject }}
@endcomponent

{{ $messageBody }}

---

*Odgovorite direktno na ovaj email da biste kontaktirali pošiljaoca.*
@endcomponent
