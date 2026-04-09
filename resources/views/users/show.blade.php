<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Seller') }}: {{ $user->name }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {{-- Seller card --}}
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 flex items-center gap-5">
                <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <span class="text-2xl font-bold text-indigo-600">
                        {{ strtoupper(substr($user->name, 0, 1)) }}
                    </span>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900">{{ $user->name }}</h1>
                    <p class="text-sm text-gray-500 mt-0.5">
                        {{ __('Member since') }} {{ $user->created_at->format('F Y') }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ $ads->total() }} {{ $ads->total() === 1 ? __('ad') : __('ads') }} {{ __('posted') }}
                    </p>
                </div>
            </div>

            {{-- Ads grid --}}
            @if($ads->total() > 0)
                <div id="ads-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    @include('partials.ad-cards')
                </div>

                @if($ads->hasMorePages())
                    <div class="mt-8 text-center"
                         x-data="{ page: 2, loading: false, hasMore: true }"
                         x-show="hasMore">
                        <button
                            @click="
                                loading = true;
                                fetch('{{ route('user.show', $user) }}?page=' + page, {
                                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                                })
                                .then(r => r.json())
                                .then(data => {
                                    document.getElementById('ads-grid').insertAdjacentHTML('beforeend', data.html);
                                    hasMore = data.hasMore;
                                    page++;
                                    loading = false;
                                });
                            "
                            :disabled="loading"
                            class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
                                   text-white text-sm font-medium rounded-lg transition-colors">
                            <svg x-show="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            <span x-text="loading ? '{{ __('Loading…') }}' : '{{ __('Load more') }}'"></span>
                        </button>
                    </div>
                @endif
            @else
                <div class="text-center py-16 text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p class="text-sm">{{ __('No ads posted yet.') }}</p>
                </div>
            @endif

            <div class="mt-6">
                <a href="{{ route('home') }}" class="text-sm text-indigo-600 hover:underline">
                    ← {{ __('Back to all ads') }}
                </a>
            </div>

        </div>
    </div>
</x-app-layout>
