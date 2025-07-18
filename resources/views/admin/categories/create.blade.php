<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Create Category') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-6 shadow-sm sm:rounded-lg">

                <form method="POST" action="{{ route('admin.categories.store') }}">
                    @csrf

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">{{ __('Name') }}</label>
                        <input type="text" name="name" class="w-full border rounded p-2" value="{{ old('name') }}">
                        @error('name') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <label for="parent_id">{{ __('Parent Category') }}</label>
                    <select name="parent_id" id="parent_id" class="form-control mb-4">
                        <option value="">{{ __('None (Top level)') }}</option>
                        @foreach ($categories as $cat)
                            <option value="{{ $cat->id }}" {{ old('parent_id', $category->parent_id ?? null) == $cat->id ? 'selected' : '' }}>
                                {{ $cat->name }}
                            </option>
                        @endforeach
                    </select>

                    <div>
                        <x-button type="submit" class="mb-4">{{ __('Create') }}</x-button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>
