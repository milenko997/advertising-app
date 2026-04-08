<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Edit Advertisement') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white shadow-sm sm:rounded-lg p-6">

                <form method="POST" action="{{ route('admin.advertisements.update', $advertisement) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Title') }}</label>
                        <input type="text" name="title" value="{{ old('title', $advertisement->title) }}" class="w-full border rounded p-2">
                        @error('title') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Description') }}</label>
                        <textarea name="description" class="w-full border rounded p-2">{{ old('description', $advertisement->description) }}</textarea>
                        @error('description') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Price') }}</label>
                        <input type="text" name="price" value="{{ old('price', $advertisement->price) }}" class="w-full border rounded p-2">
                        @error('price') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Condition') }}</label>
                        <select name="condition" class="w-full border rounded p-2">
                            <option value="new" {{ old('condition', $advertisement->condition) === 'new' ? 'selected' : '' }}>{{ __('New') }}</option>
                            <option value="used" {{ old('condition', $advertisement->condition) === 'used' ? 'selected' : '' }}>{{ __('Used') }}</option>
                        </select>
                        @error('condition') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    @include('partials.image-upload', ['current' => $advertisement->image])

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Phone') }}</label>
                        <input type="text" name="phone" value="{{ old('phone', $advertisement->phone) }}" class="w-full border rounded p-2">
                        @error('phone') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Location') }}</label>
                        <input type="text" name="location" value="{{ old('location', $advertisement->location) }}" class="w-full border rounded p-2">
                        @error('location') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block font-medium text-sm text-gray-700">{{ __('Category') }}</label>
                        <select name="category_id" class="w-full border rounded p-2">
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" {{ $advertisement->category_id == $category->id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('category_id') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mt-6">
                        <x-button type="submit">{{ __('Update') }}</x-button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>
