@component('mail::message')
# Nova poruka sa kontakt forme

**Od:** {{ $senderName }} ({{ $senderEmail }})

**Predmet:** {{ $messageSubject }}

---

{{ $messageBody }}

---

*Odgovorite direktno na ovaj email da biste kontaktirali pošiljaoca.*
@endcomponent
