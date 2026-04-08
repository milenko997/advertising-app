<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Trash') }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            @include('partials.flash')

            @forelse($ads as $ad)
                <div class="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 mb-4 opacity-75">

                    @if($ad->image)
                        <img src="{{ asset('storage/' . $ad->image) }}"
                             alt="{{ $ad->title }}"
                             class="w-24 h-20 object-cover rounded-lg shrink-0 grayscale">
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
                                <p class="font-semibold text-gray-700">{{ $ad->title }}</p>
                                <p class="text-sm text-gray-400 mt-0.5 truncate">{{ $ad->description }}</p>
                                <p class="text-xs text-red-500 mt-2">
                                    {{ __('Deleted') }}: {{ $ad->deleted_at->format('d.m.Y') }}
                                </p>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <form action="{{ route('advertisements.restore', $ad->id) }}" method="POST">
                                    @csrf
                                    @method('PATCH')
                                    <x-button variant="secondary">{{ __('Restore') }}</x-button>
                                </form>
                                <form action="{{ route('advertisements.forceDelete', $ad->id) }}" method="POST"
                                      onsubmit="return confirm('{{ __('This cannot be undone. Are you sure?') }}')">
                                    @csrf
                                    @method('DELETE')
                                    <x-button variant="danger">{{ __('Delete Forever') }}</x-button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <svg class="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <p class="text-gray-500">{{ __('Your trash is empty.') }}</p>
                </div>
            @endforelse
        </div>
    </div>
</x-app-layout>
