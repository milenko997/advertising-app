<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Categories') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="mb-4">
                <x-button href="{{ route('admin.categories.create') }}" class="mb-4">{{ __('Add Category') }}</x-button>
            </div>

            <div class="bg-white shadow-sm sm:rounded-lg p-6">
                @if(session('success'))
                    <div class="mb-4 text-green-600 font-semibold">{{ session('success') }}</div>
                @endif

                @forelse ($categories as $category)
                    <div class="border-b py-4 flex justify-between items-center">
                        <div>
                            <strong>{{ $category->name }}</strong>
                            @if ($category->parent)
                                <span class="text-sm text-gray-500"> → {{ $category->parent->name }}</span>
                            @endif
                        </div>
                        <div class="flex gap-4">
                            <x-button href="{{ route('admin.categories.edit', $category) }}" >{{ __('EDIT') }}</x-button>

                            <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                                @csrf
                                @method('DELETE')
                                <x-button type="submit" class="bg-danger">{{ __('DELETE') }}</x-button>
                            </form>
                        </div>
                    </div>
                @empty
                    <p>{{ __('No categories found.') }}</p>
                @endforelse
            </div>
        </div>
    </div>
</x-app-layout>
