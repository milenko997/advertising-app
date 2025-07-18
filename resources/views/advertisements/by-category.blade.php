<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ 'Category: ' . $category->name }}
        </h2>
    </x-slot>

    <div class="py-12">
        <aside class="fixed right-0 top-1/2 -translate-y-1/2">
            @include('partials.sidebar')
        </aside>

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white">
                    @forelse ($advertisements as $ad)
                        <div class="border p-4 mb-4 rounded shadow">
                            <a href="/advertisements/{{ $ad->slug }}">
                                <h2 class="text-xl font-semibold">{{ $ad->title }}</h2>

                                <p class="text-gray-700 mb-2">{{ $ad->description }}</p>

                                <p class="text-sm text-gray-500 mb-2">{{ __('Price') }}: {{ $ad->price }}</p>

                                <p class="text-sm text-gray-500 mb-2">{{ __('Condition') }}: {{ $ad->condition }}</p>

                                @if($ad->image)
                                    <img src="{{ asset('storage/' . $ad->image) }}" alt="image" class="w-48 h-auto mt-2 mb-2">
                                @endif

                                <p class="text-sm text-gray-500 mt-2">{{ __('Phone') }}: {{ $ad->phone }}</p>

                                <p class="text-sm text-gray-500 mt-2">{{ __('Location') }}: {{ $ad->location }}</p>

                                <p class="text-sm text-gray-500 mt-2">{{ __('Category') }}: {{ $ad->category->name }}</p>

                                <p class="text-sm text-gray-500 mt-2">{{ __('Author') }}: {{ $ad->user->name }}</p>

                                @if ($ad->created_at != $ad->updated_at)
                                    <p class="text-sm text-gray-500 mt-2">{{ __('Updated') }}: {{ $ad->updated_at->format('d.m.Y') }}</p>
                                @else
                                    <p class="text-sm text-gray-500 mt-2">{{ __('Posted') }}: {{ $ad->created_at->format('d.m.Y') }}</p>
                                @endif

                            </a>
                        </div>
                    @empty
                        <p>{{ __('No advertisements found in this category.') }}</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
