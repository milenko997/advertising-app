<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Saved Ads') }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            @if($ads->isEmpty())
                <div class="text-center py-20 bg-white rounded-xl border border-gray-200">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                    <p class="text-gray-500 font-medium">{{ __('No saved ads yet.') }}</p>
                    <a href="{{ route('home') }}" class="mt-3 inline-block text-sm text-indigo-600 hover:underline">
                        {{ __('Browse ads') }}
                    </a>
                </div>
            @else
                <div id="ads-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    @include('partials.ad-cards', ['ads' => $ads])
                </div>

                @if($ads->hasMorePages())
                    <div class="mt-8 text-center"
                         x-data="{ page: 2, loading: false, hasMore: true }"
                         x-show="hasMore">
                        <button @click="
                                loading = true;
                                const params = new URLSearchParams(window.location.search);
                                params.set('page', page);
                                fetch('{{ route('favorites.index') }}?' + params, {
                                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                                })
                                .then(r => r.json())
                                .then(data => {
                                    document.getElementById('ads-grid').insertAdjacentHTML('beforeend', data.html);
                                    hasMore = data.hasMore;
                                    page++;
                                    loading = false;
                                })"
                                :disabled="loading"
                                class="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50">
                            <svg x-show="loading" class="w-4 h-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            <span x-text="loading ? '{{ __('Loading…') }}' : '{{ __('Load More') }}'"></span>
                        </button>
                    </div>
                @endif
            @endif

        </div>
    </div>
</x-app-layout>
