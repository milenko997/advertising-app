<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Post Advertisement') }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                @if ($errors->any())
                    <div class="mb-5 bg-red-50 border border-red-200 rounded-lg p-4">
                        <ul class="text-sm text-red-600 space-y-1">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form action="{{ route('advertisements.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    {{-- Title --}}
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Title') }}</label>
                        <input type="text" name="title" value="{{ old('title') }}"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        @error('title') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    {{-- Description --}}
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Description') }}</label>
                        <textarea name="description" rows="4"
                                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">{{ old('description') }}</textarea>
                        @error('description') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    {{-- Vehicle Type + Availability --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Vehicle Type') }} <span class="text-red-500">*</span></label>
                            <select name="vehicle_type"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="" disabled {{ old('vehicle_type') ? '' : 'selected' }}>{{ __('Select vehicle type') }}</option>
                                @foreach(['truck' => 'Truck', 'van' => 'Van', 'pickup' => 'Pickup', 'trailer' => 'Trailer', 'flatbed' => 'Flatbed', 'refrigerator_truck' => 'Refrigerator Truck', 'tanker' => 'Tanker', 'other' => 'Other'] as $val => $label)
                                    <option value="{{ $val }}" {{ old('vehicle_type') === $val ? 'selected' : '' }}>{{ __($label) }}</option>
                                @endforeach
                            </select>
                            @error('vehicle_type') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Availability') }} <span class="text-red-500">*</span></label>
                            <select name="availability"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="available" {{ old('availability', 'available') === 'available' ? 'selected' : '' }}>{{ __('Available') }}</option>
                                <option value="on_request" {{ old('availability') === 'on_request' ? 'selected' : '' }}>{{ __('On Request') }}</option>
                            </select>
                            @error('availability') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    {{-- Payload + Route --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Payload Capacity') }}</label>
                            <input type="text" name="payload" value="{{ old('payload') }}" placeholder="{{ __('e.g. 10 tons') }}"
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            @error('payload') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Area / Route') }}</label>
                            <input type="text" name="route" value="{{ old('route') }}" placeholder="{{ __('e.g. National, Belgrade–Novi Sad') }}"
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            @error('route') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    {{-- Price --}}
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Price') }}</label>
                        <input type="text" name="price" value="{{ old('price') }}" placeholder="{{ __('e.g. 0.5 EUR/km, 50 EUR/h, Price on request') }}"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <p class="mt-1 text-xs text-gray-400">{{ __('Leave empty to show "Price on request"') }}</p>
                        @error('price') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    {{-- Phone + Location --}}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Phone') }} <span class="text-red-500">*</span></label>
                            <input type="text" name="phone" value="{{ old('phone') }}" maxlength="15"
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            @error('phone') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Location') }} <span class="text-red-500">*</span></label>
                            <input type="text" name="location" value="{{ old('location') }}"
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            @error('location') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    {{-- Category --}}
                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Category') }} <span class="text-red-500">*</span></label>
                        <select name="category_id"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">{{ __('Select category') }}</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}" {{ old('category_id') == $category->id ? 'selected' : '' }}>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                        @error('category_id') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    @include('partials.image-upload')

                    <div class="mt-6 flex items-center gap-3">
                        <x-button type="submit">{{ __('Post Ad') }}</x-button>
                        <a href="{{ route('advertisements.user') }}" class="text-sm text-gray-500 hover:text-gray-700">{{ __('Cancel') }}</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
