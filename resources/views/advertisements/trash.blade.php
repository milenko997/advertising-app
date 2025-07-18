<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Trash') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white">
                    @forelse($ads as $ad)
                        <div class="border p-4 mb-4 rounded shadow flex justify-content-between align-items-center">
                            <div>
                                <h2 class="text-xl font-semibold">{{ $ad->title }}</h2>
                                <p class="text-gray-700 mb-2">{{ $ad->description }}</p>

                                @if($ad->image)
                                    <img src="{{ asset('storage/' . $ad->image) }}" alt="image" class="w-48 h-auto">
                                @endif

                                <p class="text-sm text-gray-500 mt-2">{{ __('Deleted') }}: {{ $ad->deleted_at->format('d.m.Y') }}</p>
                            </div>

                            <div>
                                <form action="{{ route('advertisements.restore', $ad->id) }}" method="POST">
                                    @csrf
                                    @method('PATCH')
                                    <x-button class="mb-2">{{ __('RESTORE') }}</x-button>
                                </form>

                                <form action="{{ route('advertisements.forceDelete', $ad->id) }}" method="POST" onsubmit="return confirm('Are you sure? This cannot be undone.')">
                                    @csrf
                                    @method('DELETE')
                                    <x-button class="bg-danger">{{ __('PERMANENTLY DELETE') }}</x-button>
                                </form>
                            </div>
                        </div>
                    @empty
                        <p>{{ __('Your Trash is empty.') }}</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
