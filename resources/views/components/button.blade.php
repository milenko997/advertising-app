@props(['href' => null, 'variant' => 'primary'])

@php
$base = 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 transition ease-in-out duration-150';

$styles = match($variant) {
    'danger'    => "$base bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
    'secondary' => "$base bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
    default     => "$base bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300",
};
@endphp

@if($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $styles]) }}>{{ $slot }}</a>
@else
    <button {{ $attributes->merge(['type' => 'submit', 'class' => $styles]) }}>{{ $slot }}</button>
@endif
