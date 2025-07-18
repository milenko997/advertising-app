<!-- resources/views/partials/sidebar.blade.php -->
<div class="w-64 bg-gray-100 p-4 rounded shadow">
    <h3 class="font-bold text-lg mb-4">{{ __('Categories') }}</h3>
    @php
        $categories = \App\Models\Category::with('children')->whereNull('parent_id')->get();
    @endphp

    <ul class="space-y-2">
        @foreach ($categories as $category)
            <li>
                <a href="{{ route('advertisements.byCategory', $category->slug) }}" class="text-blue-600 hover:underline font-semibold">
                    {{ $category->name }}
                </a>

                @if ($category->children->count())
                    <ul class="ml-4 mt-1 space-y-1 list-disc list-inside text-sm text-gray-700">
                        @foreach ($category->children as $child)
                            <li>
                                <a href="{{ route('advertisements.byCategory', $child->slug) }}" class="hover:underline">
                                    {{ $child->name }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </li>
        @endforeach
    </ul>
</div>
