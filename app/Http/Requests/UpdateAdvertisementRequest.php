<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdvertisementRequest extends FormRequest
{
    public function authorize(): bool
    {
        $ad = \App\Models\Advertisement::where('slug', $this->route('slug'))->first();
        return $ad && $this->user()->can('update', $ad);
    }

    public function rules(): array
    {
        return [
            'title'         => 'required|string|min:5|max:255',
            'description'   => 'required|string|min:10|max:5000',
            'payload'       => 'nullable|string|min:2|max:100',

            'availability'  => 'required|in:available,on_request',
            'price'         => 'nullable|string|max:100',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'images'        => 'nullable|array|max:10',
            'images.*'      => 'image|mimes:jpeg,png,jpg,gif|max:10240',
            'phone'         => ['required', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'location'      => 'required|string|min:2|max:255',
            'category_id'   => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'        => 'Naslov je obavezan.',
            'title.min'             => 'Naslov mora imati najmanje :min karaktera.',
            'title.max'             => 'Naslov ne sme biti duži od :max karaktera.',
            'description.required'  => 'Opis je obavezan.',
            'description.min'       => 'Opis mora imati najmanje :min karaktera.',
            'description.max'       => 'Opis ne sme biti duži od :max karaktera.',
            'payload.min'           => 'Tovar mora imati najmanje :min karaktera (npr. 10 tona).',
            'availability.required' => 'Dostupnost je obavezna.',
            'availability.in'       => 'Dostupnost mora biti "available" ili "on_request".',
            'price.numeric'         => 'Cena mora biti broj.',
            'image.image'           => 'Fajl mora biti slika.',
            'image.max'             => 'Slika ne sme biti veća od :max KB.',
            'image.uploaded'        => 'Slika je prevelika za otpremanje. Koristite sliku manju od 10 MB.',
            'images.max'            => 'Možete otpremiti najviše 10 fotografija u galeriji.',
            'images.*.image'        => 'Svaki fajl u galeriji mora biti slika.',
            'images.*.mimes'        => 'Slike u galeriji moraju biti JPEG, PNG ili GIF.',
            'images.*.max'          => 'Svaka slika u galeriji ne sme biti veća od 10 MB.',
            'phone.required'        => 'Broj telefona je obavezan.',
            'phone.regex'           => 'Unesite ispravan broj telefona (cifre, razmaci, +, -, zagrade).',
            'location.required'     => 'Lokacija je obavezna.',
            'location.min'          => 'Lokacija mora imati najmanje :min karaktera.',
            'category_id.required'  => 'Kategorija je obavezna.',
            'category_id.exists'    => 'Izabrana kategorija ne postoji.',
        ];
    }
}
