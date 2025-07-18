<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Edit Customer') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-6 shadow-sm sm:rounded-lg">
                <form method="POST" action="{{ route('admin.customers.update', $customer) }}" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">{{ __('Name') }}</label>
                        <input type="text" name="name" class="w-full border rounded p-2" value="{{ old('name', $customer->name) }}">
                        @error('name') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">{{ __('Email') }}</label>
                        <input type="text" name="email" class="w-full border rounded p-2" value="{{ old('email', $customer->email) }}">
                        @error('email') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700">{{ __('Role') }}</label>
                        <select name="role" class="w-full border rounded p-2">
                            <option value="customer" {{ $customer->role === 'customer' ? 'selected' : '' }}>{{ __('Customer') }}</option>
                            <option value="admin" {{ $customer->role === 'admin' ? 'selected' : '' }}>{{ __('Admin') }}</option>
                        </select>
                        @error('role') <div class="text-red-600 text-sm">{{ $message }}</div> @enderror
                    </div>

                    <div>
                        <x-button type="submit" class="mb-4">{{ __('Update') }}</x-button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</x-app-layout>
