<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Edit Advertisement') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="bg-white shadow-sm sm:rounded-lg p-6">
                    <form method="POST" action="{{ route('advertisements.update', $ad->slug) }}" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Title') }}</label>
                            <input type="text" name="title" value="{{ old('title', $ad->title) }}" class="w-full border rounded p-2">
                            @error('title') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Description') }}</label>
                            <textarea name="description" class="w-full border rounded p-2">{{ old('description', $ad->description) }}</textarea>
                            @error('description') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Price') }}</label>
                            <input type="text" name="price" value="{{ old('price', $ad->price) }}" class="w-full border rounded p-2">
                            @error('price') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Condition') }}</label>
                            <select name="condition" class="w-full border rounded p-2">
                                <option value="new" {{ old('condition', $ad->condition) === 'new' ? 'selected' : '' }}>{{ __('New') }}</option>
                                <option value="used" {{ old('condition', $ad->condition) === 'used' ? 'selected' : '' }}>{{ __('Used') }}</option>
                            </select>
                            @error('condition') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Phone') }}</label>
                            <input type="text" name="phone" value="{{ old('phone', $ad->phone) }}" class="w-full border rounded p-2" maxlength="15">
                            @error('phone') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Location') }}</label>
                            <input type="text" name="location" value="{{ old('location', $ad->location) }}" class="w-full border rounded p-2">
                            @error('location') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Category') }}</label>
                            <select name="category_id" class="w-full border rounded p-2">
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}" {{ old('category_id', $ad->category_id) == $category->id ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('category_id') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                        </div>

                        <div class="mb-4">
                            <label class="block font-medium text-sm text-gray-700">{{ __('Current Image') }}</label>
                            <img src="{{ asset('storage/' . $ad->image) }}" alt="Advertisement Image" class="w-48 h-auto rounded shadow mb-2">

                            <label class="block font-medium text-sm text-gray-700 mt-2">{{ __('Change Image') }}</label>
                            <input type="file" name="image" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                file:rounded file:border-0 file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                            @error('image') <div class="text-red-600 text-sm mt-1">{{ $message }}</div> @enderror
                        </div>

                        <div class="mt-6">
                            <x-button type="submit">{{ __('Update') }}</x-button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>
