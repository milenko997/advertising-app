<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('All Advertisements') }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            @include('partials.flash')

            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Title') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Category') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('User') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Price') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Date') }}</th>
                            <th class="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @forelse($ads as $ad)
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <p class="font-medium text-gray-900 text-sm">{{ $ad->title }}</p>
                                    <p class="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{{ $ad->description }}</p>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ $ad->category->name }}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ $ad->user->name }}</td>
                                <td class="px-6 py-4 text-sm font-semibold text-indigo-600">{{ $ad->price }}</td>
                                <td class="px-6 py-4 text-sm text-gray-400">{{ $ad->created_at->format('d.m.Y') }}</td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <x-button :href="route('admin.advertisements.edit', $ad)" variant="secondary">
                                            {{ __('Edit') }}
                                        </x-button>
                                        <form action="{{ route('admin.advertisements.destroy', $ad) }}" method="POST"
                                              onsubmit="return confirm('{{ __('Are you sure?') }}')">
                                            @csrf
                                            @method('DELETE')
                                            <x-button variant="danger">{{ __('Delete') }}</x-button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-6 py-16 text-center text-gray-500">
                                    {{ __('No advertisements found.') }}
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-app-layout>
