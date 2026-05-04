<?php

return [
    'required' => 'Polje :attribute je obavezno.',
    'email'    => 'Polje :attribute mora biti ispravna email adresa.',
    'min'      => [
        'string' => 'Polje :attribute mora imati najmanje :min karaktera.',
    ],
    'max'      => [
        'string' => 'Polje :attribute ne sme imati više od :max karaktera.',
    ],
    'confirmed' => 'Potvrda lozinke se ne poklapa.',
    'unique'    => 'Ova vrednost za :attribute je već zauzeta.',
    'password'  => [
        'letters'       => 'Lozinka mora sadržati najmanje jedno slovo.',
        'mixed'         => 'Lozinka mora sadržati mala i velika slova.',
        'numbers'       => 'Lozinka mora sadržati najmanje jedan broj.',
        'symbols'       => 'Lozinka mora sadržati najmanje jedan specijalni karakter.',
        'uncompromised' => 'Ova lozinka je bila deo curenja podataka. Izaberite drugu lozinku.',
    ],
    'attributes' => [
        'email'                 => 'email adresa',
        'password'              => 'lozinka',
        'password_confirmation' => 'potvrda lozinke',
        'name'                  => 'ime',
        'phone'                 => 'broj telefona',
    ],
];
