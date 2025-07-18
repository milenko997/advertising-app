<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Edit Category') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-6 shadow-sm sm:rounded-lg">

                <form method="POST" action="{{ route('admin.categories.update', $category) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" class="w-full border rounded p-2" value="{{ old('name', $category->name) }}">
                        @error('name') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">Parent Category (optional)</label>
                        <select name="parent_id" class="w-full border rounded p-2">
                            <option value="">-- None --</option>
                            @foreach($categories as $parent)
                                @if($parent->id !== $category->id)
                                    <option value="{{ $parent->id }}" {{ $category->parent_id == $parent->id ? 'selected' : '' }}>
                                        {{ $parent->name }}
                                    </option>
                                @endif
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <x-button type="submit" class="mb-4">{{ __('Update') }}</x-button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>
