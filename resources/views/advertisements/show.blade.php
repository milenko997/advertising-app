<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ $ad->title }}</h2>
            @auth
                @if(auth()->id() === $ad->user_id)
                    <div class="flex gap-2">
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
                @endif
            @endauth
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                @if($ad->image)
                    <img src="{{ asset('storage/' . $ad->image) }}"
                         alt="{{ $ad->title }}"
                         class="w-full max-h-80 object-cover">
                @endif

                <div class="p-6">
                    {{-- Price + availability --}}
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-2xl font-bold text-indigo-600">
                            {{ $ad->price ?: __('Price on request') }}
                        </span>
                        <span class="px-2.5 py-0.5 text-xs font-medium rounded-full
                            {{ $ad->availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700' }}">
                            {{ $ad->availability === 'available' ? __('Available') : __('On Request') }}
                        </span>
                    </div>

                    {{-- Description --}}
                    <p class="text-gray-700 leading-relaxed mb-6">{{ $ad->description }}</p>

                    {{-- Bookmark --}}
                    @auth
                    <div class="mb-4"
                         x-data="{ saved: {{ auth()->user()->favorites()->where('advertisement_id', $ad->id)->exists() ? 'true' : 'false' }}, loading: false }">
                        <button @click="
                                    if (loading) return;
                                    loading = true;
                                    fetch('{{ route('favorites.toggle', $ad->id) }}', {
                                        method: 'POST',
                                        headers: {
                                            'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content,
                                            'Accept': 'application/json'
                                        }
                                    }).then(r => r.json()).then(d => { saved = d.saved; loading = false; })"
                                class="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition"
                                :class="saved
                                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'">
                            <svg x-show="!saved" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                            <svg x-show="saved" class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                            <span x-text="saved ? '{{ __('Saved') }}' : '{{ __('Save ad') }}'"></span>
                        </button>
                    </div>
                    @endauth

                    {{-- Details grid --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Vehicle Type') }}</p>
                            <p class="text-gray-800">{{ ucwords(str_replace('_', ' ', $ad->vehicle_type)) ?: '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Category') }}</p>
                            <p class="text-gray-800">{{ $ad->category->name }}</p>
                        </div>
                        @if($ad->payload)
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Payload Capacity') }}</p>
                            <p class="text-gray-800">{{ $ad->payload }}</p>
                        </div>
                        @endif
                        @if($ad->route)
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Area / Route') }}</p>
                            <p class="text-gray-800">{{ $ad->route }}</p>
                        </div>
                        @endif
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Location') }}</p>
                            <p class="text-gray-800">{{ $ad->location }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Contact') }}</p>
                            <a href="tel:{{ $ad->phone }}" class="text-indigo-600 hover:underline font-medium">
                                {{ $ad->phone }}
                            </a>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Owner') }}</p>
                            <a href="{{ route('user.show', $ad->user) }}"
                               class="text-indigo-600 hover:underline font-medium">
                                {{ $ad->user->name }}
                            </a>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                {{ $ad->created_at != $ad->updated_at ? __('Updated') : __('Posted') }}
                            </p>
                            <p class="text-gray-800">
                                {{ ($ad->created_at != $ad->updated_at ? $ad->updated_at : $ad->created_at)->format('d.m.Y') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex items-center justify-between">
                <a href="{{ route('home') }}" class="text-sm text-indigo-600 hover:underline">
                    ← {{ __('Back to all ads') }}
                </a>

                {{-- Share --}}
                <div class="relative"
                     x-data="{ open: false, copied: false, url: '{{ url()->current() }}', title: '{{ addslashes($ad->title) }}' }"
                     @keydown.escape.window="open = false"
                     @click.outside="open = false">

                    <button @click="open = !open"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                        {{ __('Share') }}
                    </button>

                    <div x-show="open"
                         x-transition:enter="transition ease-out duration-150"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-100"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95"
                         class="absolute right-0 bottom-10 z-50 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2">

                        <p class="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">{{ __('Share this ad') }}</p>

                        {{-- Copy link --}}
                        <button @click="navigator.clipboard.writeText(url).then(() => { copied = true; setTimeout(() => { copied = false; open = false }, 1500) })"
                                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                <template x-if="!copied">
                                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                    </svg>
                                </template>
                                <template x-if="copied">
                                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </template>
                            </span>
                            <span x-text="copied ? '{{ __('Link copied!') }}' : '{{ __('Copy link') }}'"></span>
                        </button>

                        <div class="border-t border-gray-100 my-1"></div>

                        {{-- WhatsApp --}}
                        <a href="https://wa.me/?text={{ urlencode($ad->title . ' – ' . url()->current()) }}"
                           target="_blank" rel="noopener"
                           class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <span class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.849L0 24l6.335-1.508A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.502-5.176-1.381l-.371-.218-3.853.917.976-3.762-.241-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                                </svg>
                            </span>
                            WhatsApp
                        </a>

                        {{-- Viber --}}
                        <a href="viber://forward?text={{ urlencode($ad->title . ' – ' . url()->current()) }}"
                           class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <span class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.398.002C8.898-.034 3.248.49 1.07 6.19c-.694 1.747-.733 4.17-.687 5.862.046 1.692.179 4.858 1.908 6.922.67.792 1.612 1.303 2.664 1.411v2.532c0 .478.578.716.905.374l2.16-2.334c.387.037.774.056 1.155.055 1.54 0 7.565-.29 9.414-5.64.694-1.748.733-4.17.687-5.863-.046-1.692-.179-4.858-1.908-6.921C15.99.796 13.898.038 11.398.002zm-.063 1.8c2.108.031 3.854.626 5.11 2.09 1.4 1.63 1.549 4.212 1.595 5.897.046 1.685-.033 3.759-.594 5.227-1.468 4.136-6.53 4.477-7.945 4.477-.388.001-.78-.018-1.167-.055l-.448-.042-2.652 2.864V19.19l-.572-.104c-.88-.16-1.645-.564-2.185-1.205-1.444-1.704-1.591-4.493-1.634-6.052-.044-1.56.018-3.759.595-5.227C3.085 1.77 8.147 1.77 11.335 1.802zM8.763 5.89c-.178-.005-.357.067-.476.21l-.73.846c-.544.636-.544 1.657.065 2.852.815 1.614 2.073 3.208 3.666 4.37 1.592 1.16 3.24 1.835 4.99 2.054.906.113 1.723-.34 2.073-.969l.353-.637c.2-.361.112-.836-.206-1.037l-2.163-1.384c-.32-.203-.757-.115-1.018.207l-.596.734c-.17.21-.444.267-.67.135-.9-.513-2.424-1.88-2.958-2.826-.14-.247-.09-.556.12-.727l.748-.599c.29-.233.357-.658.152-.98L9.453 6.2a.764.764 0 00-.69-.31z"/>
                                </svg>
                            </span>
                            Viber
                        </a>

                        {{-- Facebook --}}
                        <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(url()->current()) }}"
                           target="_blank" rel="noopener"
                           class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <span class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                                </svg>
                            </span>
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
