<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Create Advertisement') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white">
                    <form action="{{ route('advertisements.store') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <x-label>{{ __('Title') }}:</x-label>
                        <x-input name="title" class="mb-2"></x-input>

                        <x-label>{{ __('Description') }}:</x-label>
                        <x-textarea name="description" class="mb-2"></x-textarea>

                        <x-label>{{ __('Price') }}:</x-label>
                        <x-input name="price" class="mb-2"></x-input>

                        <x-label>{{ __('Condition') }}:</x-label>
                        <select name="condition" class="mb-2">
                            <option value="" selected disabled>{{ __('Select Option') }}</option>
                            <option value="new">{{ __('New') }}</option>
                            <option value="used">{{ __('Used') }}</option>
                        </select>

                        @include('partials.image-upload')

                        <x-label>{{ __('Phone') }}:</x-label>
                        <x-input name="phone" class="mb-2" maxlength="15"></x-input>

                        <x-label>{{ __('Location') }}:</x-label>
                        <x-input name="location" class="mb-2"></x-input>

                        <x-label>{{ __('Category') }}:</x-label>
                        <select name="category_id" required class="mb-2">
                            <option value="">{{ __('Select category') }}</option>
                            @foreach($categories as $category)
                                <option value="{{ $category->id }}">{{ $category->name }}</option>
                            @endforeach
                        </select>
                        <br>
                        <x-button>{{ __('Save') }}</x-button>
                    </form>

                    @if ($errors->any())
                        <div class="bg-red-100 text-red-700 p-3 mb-4">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
