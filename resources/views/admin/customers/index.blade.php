<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Customers') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white shadow-sm sm:rounded-lg p-6">
                @if(session('success'))
                    <div class="mb-4 text-green-600 font-semibold">{{ session('success') }}</div>
                @endif

                @forelse ($customers as $customer)
                    <div class="border-b py-4 flex justify-between items-center">
                        <div>
                            <strong>{{ $customer->name }}</strong><br>
                            <strong>{{ $customer->email }}</strong>
                        </div>
                        <div class="flex gap-4">
                            <x-button href="{{ route('admin.customers.edit', $customer) }}" >{{ __('EDIT') }}</x-button>

                            <form action="{{ route('admin.customers.destroy', $customer) }}" method="POST" onsubmit="return confirm('Are you sure?')">
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
