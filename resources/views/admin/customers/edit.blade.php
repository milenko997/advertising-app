<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Edit Customer') }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
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

                <form action="{{ route('admin.customers.update', $customer) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Name') }}</label>
                        <input type="text" name="name" value="{{ old('name', $customer->name) }}"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        @error('name') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Email') }}</label>
                        <input type="email" name="email" value="{{ old('email', $customer->email) }}"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        @error('email') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Role') }}</label>
                        <select name="role"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="customer" {{ old('role', $customer->role) === 'customer' ? 'selected' : '' }}>{{ __('Customer') }}</option>
                            <option value="admin" {{ old('role', $customer->role) === 'admin' ? 'selected' : '' }}>{{ __('Admin') }}</option>
                        </select>
                        @error('role') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div class="flex items-center gap-3">
                        <x-button type="submit">{{ __('Save Changes') }}</x-button>
                        <a href="{{ route('admin.customers.index') }}" class="text-sm text-gray-500 hover:text-gray-700">{{ __('Cancel') }}</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
