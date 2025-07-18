<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ $advertisement->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white shadow-sm sm:rounded-lg p-6">

                <p class="mb-2 text-gray-700"><strong>{{ __('Description') }}:</strong> {{ $advertisement->description }}</p>
                <p class="mb-2 text-gray-700"><strong>{{ __('Category') }}:</strong> {{ $advertisement->category->name ?? '-' }}</p>
                <p class="mb-2 text-gray-700"><strong>{{ __('Posted by') }}:</strong> {{ $advertisement->user->name ?? 'N/A' }}</p>
                <p class="mb-2 text-gray-700"><strong>{{ __('Date') }}:</strong> {{ $advertisement->created_at->format('d.m.Y') }}</p>

                @if($advertisement->image)
                    <img src="{{ asset('storage/' . $advertisement->image) }}" alt="Image" class="w-48 h-auto mt-4 rounded">
                @endif

            </div>
        </div>
    </div>
</x-app-layout>
