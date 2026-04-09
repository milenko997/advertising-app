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
                    {{-- Price + condition --}}
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-2xl font-bold text-indigo-600">{{ $ad->price }}</span>
                        @if($ad->condition)
                            <span class="px-2.5 py-0.5 text-xs font-medium rounded-full
                                {{ $ad->condition === 'new' || $ad->condition === 'New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700' }}">
                                {{ ucfirst($ad->condition) }}
                            </span>
                        @endif
                    </div>

                    {{-- Description --}}
                    <p class="text-gray-700 leading-relaxed mb-6">{{ $ad->description }}</p>

                    {{-- Details grid --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Category') }}</p>
                            <p class="text-gray-800">{{ $ad->category->name }}</p>
                        </div>
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
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Seller') }}</p>
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

            <div class="mt-4">
                <a href="{{ route('home') }}" class="text-sm text-indigo-600 hover:underline">
                    ← {{ __('Back to all ads') }}
                </a>
            </div>
        </div>
    </div>
</x-app-layout>
