@component('mail::message')
# Dobili ste novu recenziju

Zdravo **{{ $displayName }}**,

**{{ $reviewerName }}** je ostavio/la recenziju na Vašem profilu:

@component('mail::panel')
{{ str_repeat('★', $rating) }}{{ str_repeat('☆', 5 - $rating) }} **({{ $rating }}/5)**
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/korisnik/' . $userSlug . '#recenzije'])
Pogledajte recenziju
@endcomponent

Srdačan pozdrav,
**Tim Transporteri**
@endcomponent
