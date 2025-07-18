<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight text-capitalize">
            {{ $ad->title }}
        </h2>
    </x-slot>

    <div class="py-12">
        <aside class="fixed right-0 top-1/2 -translate-y-1/2">
            @include('partials.sidebar')
        </aside>

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white">
                    @if($ad->image)
                        <img src="{{ asset('storage/' . $ad->image) }}" alt="image" class="w-50 h-auto mb-4">
                    @endif

                    <p class="text-gray-700 mb-2">{{ $ad->description }}</p>

                    <p class="text-sm text-gray-500 mb-2">{{ __('Price') }}: {{ $ad->price }}</p>

                    <p class="text-sm text-gray-500 mb-2">{{ __('Condition') }}: {{ $ad->condition }}</p>

                    <a href="tel:{{ $ad->phone }}" class="text-sm text-gray-700 mb-2">{{ __('Phone') }}: {{ $ad->phone }}</a>

                    <p class="text-sm text-gray-500 mt-2">{{ __('Location') }}: {{ $ad->location }}</p>

                    <p class="text-sm text-gray-500 mt-2">{{ __('Category') }}: {{ $ad->category->name }}</p>

                    <p class="text-sm text-gray-500 mt-2">{{ __('Author') }}: {{ $ad->user->name }}</p>

                    @if ($ad->created_at != $ad->updated_at)
                        <p class="text-sm text-gray-500 mt-2">Updated: {{ $ad->updated_at->format('d.m.Y') }}</p>
                    @else
                        <p class="text-sm text-gray-500 mt-2">Posted: {{ $ad->created_at->format('d.m.Y') }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
