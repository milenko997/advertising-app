<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ $advertisement->title }}</h2>
            <div class="flex gap-2">
                <x-button :href="route('admin.advertisements.edit', $advertisement)" variant="secondary">
                    {{ __('Edit') }}
                </x-button>
                <form action="{{ route('admin.advertisements.destroy', $advertisement) }}" method="POST"
                      onsubmit="return confirm('{{ __('Are you sure?') }}')">
                    @csrf
                    @method('DELETE')
                    <x-button variant="danger">{{ __('Delete') }}</x-button>
                </form>
            </div>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                @if($advertisement->image)
                    <img src="{{ asset('storage/' . $advertisement->image) }}"
                         alt="{{ $advertisement->title }}"
                         class="w-full max-h-80 object-cover">
                @endif

                <div class="p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-2xl font-bold text-indigo-600">{{ $advertisement->price }}</span>
                        @if($advertisement->condition)
                            <span class="px-2.5 py-0.5 text-xs font-medium rounded-full
                                {{ $advertisement->condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700' }}">
                                {{ ucfirst($advertisement->condition) }}
                            </span>
                        @endif
                    </div>

                    <p class="text-gray-700 leading-relaxed mb-6">{{ $advertisement->description }}</p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Category') }}</p>
                            <p class="text-gray-800">{{ $advertisement->category->name }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Location') }}</p>
                            <p class="text-gray-800">{{ $advertisement->location }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Contact') }}</p>
                            <a href="tel:{{ $advertisement->phone }}" class="text-indigo-600 hover:underline font-medium">
                                {{ $advertisement->phone }}
                            </a>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Seller') }}</p>
                            <p class="text-gray-800">{{ $advertisement->user->name }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{{ __('Posted') }}</p>
                            <p class="text-gray-800">{{ $advertisement->created_at->format('d.m.Y') }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <a href="{{ route('admin.advertisements.index') }}" class="text-sm text-indigo-600 hover:underline">
                    ← {{ __('Back to all ads') }}
                </a>
            </div>
        </div>
    </div>
</x-app-layout>
