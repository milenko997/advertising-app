<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('All Advertisements') }}</h2>
    </x-slot>

    @include('partials.category-search-bar')

    <div class="py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            @if($search ?? null)
                <p class="text-sm text-gray-500 mb-5">
                    <span class="font-semibold text-gray-700">{{ $ads->total() }}</span>
                    {{ __('result(s) for') }}
                    "<span class="text-indigo-600">{{ $search }}</span>"
                </p>
            @endif

            <div x-data="{
                page: {{ $ads->currentPage() }},
                loading: false,
                hasMore: {{ $ads->hasMorePages() ? 'true' : 'false' }},
                async loadMore() {
                    if (this.loading || !this.hasMore) return;
                    this.loading = true;
                    this.page++;
                    try {
                        const params = new URLSearchParams(window.location.search);
                        params.set('page', this.page);
                        const res = await fetch('{{ url()->current() }}?' + params, {
                            headers: { 'X-Requested-With': 'XMLHttpRequest' }
                        });
                        const data = await res.json();
                        document.getElementById('ads-grid').insertAdjacentHTML('beforeend', data.html);
                        this.hasMore = data.hasMore;
                    } catch (e) {
                        this.page--;
                    } finally {
                        this.loading = false;
                    }
                }
            }">
                @if($ads->isEmpty())
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
                @else
                    <div id="ads-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        @include('partials.ad-cards')
                    </div>

                    <div class="mt-8 text-center" x-show="hasMore">
                        <button @click="loadMore" :disabled="loading"
                                class="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg x-show="loading" class="w-4 h-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <span x-text="loading ? '{{ __('Loading…') }}' : '{{ __('Load More') }}'"></span>
                        </button>
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-app-layout>
