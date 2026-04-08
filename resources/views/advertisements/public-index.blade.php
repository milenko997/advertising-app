<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('All Advertisements') }}</h2>
    </x-slot>

    @include('partials.category-search-bar')

    <div class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            @if($search ?? null)
                <p class="text-sm text-gray-500 mb-5">
                    <span class="font-semibold text-gray-700">{{ $ads->count() }}</span>
                    {{ __('result(s) for') }}
                    "<span class="text-indigo-600">{{ $search }}</span>"
                </p>
            @endif

            @forelse($ads as $ad)
                <a href="{{ route('advertisements.show', $ad->slug) }}"
                   class="group flex gap-4 bg-white border border-gray-200 rounded-xl p-4 mb-4 hover:shadow-md hover:border-indigo-200 transition-all">

                    @if($ad->image)
                        <img src="{{ asset('storage/' . $ad->image) }}"
                             alt="{{ $ad->title }}"
                             class="w-32 h-28 object-cover rounded-lg shrink-0">
                    @else
                        <div class="w-32 h-28 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    @endif

                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <h2 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors text-lg leading-tight">
                                {{ $ad->title }}
                            </h2>
                            <span class="text-lg font-bold text-indigo-600 shrink-0">{{ $ad->price }}</span>
                        </div>

                        <p class="text-sm text-gray-500 mt-1">{{ Str::limit($ad->description, 120) }}</p>

                        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                            <span class="inline-flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                </svg>
                                {{ $ad->category->name }}
                            </span>
                            <span class="inline-flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                {{ $ad->location }}
                            </span>
                            <span class="inline-flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                {{ $ad->user->name }}
                            </span>
                            <span class="ml-auto">
                                {{ $ad->created_at->format('d.m.Y') }}
                            </span>
                        </div>

                        @if($ad->condition)
                            <span class="inline-block mt-2 px-2 py-0.5 text-xs rounded-full
                                {{ $ad->condition === 'new' || $ad->condition === 'New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700' }}">
                                {{ ucfirst($ad->condition) }}
                            </span>
                        @endif
                    </div>
                </a>
            @empty
                <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <svg class="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p class="text-gray-500">
                        @if($search ?? null)
                            {{ __('No results for') }} "<strong>{{ $search }}</strong>".
                        @else
                            {{ __('No advertisements yet.') }}
                        @endif
                    </p>
                </div>
            @endforelse
        </div>
    </div>
</x-app-layout>
