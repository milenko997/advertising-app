@component('mail::message')
# Nova recenzija

Poštovani {{ $displayName }},

**{{ $reviewerName }}** je ostavio/la recenziju na Vašem profilu — {{ str_repeat('★', $rating) }}{{ str_repeat('☆', 5 - $rating) }}

@component('mail::button', ['url' => config('app.url') . '/korisnik/' . $userSlug . '#recenzije'])
Pogledajte recenziju
@endcomponent

Srdačan pozdrav,
Tim Transporteri
@endcomponent
