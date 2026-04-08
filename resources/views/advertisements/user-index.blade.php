<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('My Advertisements') }}</h2>
            <x-button :href="route('advertisements.create')">+ {{ __('Post Ad') }}</x-button>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            @include('partials.flash')

            @forelse($ads as $ad)
                <div class="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 mb-4 hover:shadow-sm transition">

                    @if($ad->image)
                        <img src="{{ asset('storage/' . $ad->image) }}"
                             alt="{{ $ad->title }}"
                             class="w-24 h-20 object-cover rounded-lg shrink-0">
                    @else
                        <div class="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    @endif

                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-4">
                            <div class="min-w-0">
                                <a href="{{ route('advertisements.show', $ad->slug) }}"
                                   class="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                    {{ $ad->title }}
                                </a>
                                <p class="text-sm text-gray-500 mt-0.5 truncate">{{ $ad->description }}</p>
                                <div class="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                    <span class="font-semibold text-indigo-600">{{ $ad->price }}</span>
                                    <span>{{ $ad->category->name }}</span>
                                    <span>{{ $ad->created_at->format('d.m.Y') }}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <x-button :href="route('advertisements.edit', $ad->slug)" variant="secondary">
                                    {{ __('Edit') }}
                                </x-button>
                                <form action="{{ route('advertisements.destroy', $ad->id) }}" method="POST"
                                      onsubmit="return confirm('{{ __('Are you sure?') }}')">
                                    @csrf
                                    @method('DELETE')
                                    <x-button variant="danger">{{ __('Delete') }}</x-button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <svg class="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p class="text-gray-500 mb-4">{{ __('You have no advertisements yet.') }}</p>
                    <x-button :href="route('advertisements.create')">+ {{ __('Post your first ad') }}</x-button>
                </div>
            @endforelse
        </div>
    </div>
</x-app-layout>
