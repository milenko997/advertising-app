@php
    $navCategories = \App\Models\Category::with('children')->whereNull('parent_id')->get();
@endphp

<div class="bg-white border-b shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3"
         x-data="{ open: null }" @click.outside="open = null">

        {{-- Category navigation --}}
        <nav class="flex flex-wrap items-center gap-1">
            <a href="{{ route('home') }}"
               class="px-3 py-1 text-sm rounded-full font-medium
                      {{ !request('search') && request()->routeIs('home') ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-600' }}">
                {{ __('All') }}
            </a>

            @foreach($navCategories as $category)
                <div class="relative">
                    <button @click="open === {{ $category->id }} ? open = null : open = {{ $category->id }}"
                            class="flex items-center gap-1 px-3 py-1 text-sm rounded-full font-medium
                                   {{ request()->routeIs('advertisements.byCategory') && (request()->route('parent') === $category->slug) ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-indigo-600' }}">
                        {{ $category->name }}
                        @if($category->children->count())
                            <svg class="w-3 h-3 transition-transform duration-150"
                                 :class="open === {{ $category->id }} ? 'rotate-180' : ''"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        @endif
                    </button>

                    @if($category->children->count())
                        <div x-show="open === {{ $category->id }}"
                             x-transition
                             class="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-max">
                            <a href="{{ route('advertisements.byCategory', ['parent' => $category->slug]) }}"
                               class="block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 font-medium">
                                {{ __('All') }} {{ $category->name }}
                            </a>
                            <div class="border-t border-gray-100 my-1"></div>
                            @foreach($category->children as $child)
                                <a href="{{ route('advertisements.byCategory', ['parent' => $category->slug, 'child' => $child->slug]) }}"
                                   class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50
                                          {{ request()->route('child') === $child->slug ? 'text-indigo-600 font-semibold' : '' }}">
                                    {{ $child->name }}
                                </a>
                            @endforeach
                        </div>
                    @endif
                </div>
            @endforeach
        </nav>

        {{-- Search --}}
        <form action="{{ route('home') }}" method="GET"
              class="flex items-center gap-2">
            <div class="relative">
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       placeholder="{{ __('Search ads or categories…') }}"
                       class="border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-sm w-64
                              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <svg class="absolute left-2.5 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
            </div>
            <button type="submit"
                    class="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                {{ __('Search') }}
            </button>
            @if(request('search'))
                <a href="{{ route('home') }}"
                   class="text-gray-400 hover:text-gray-600 text-lg leading-none" title="{{ __('Clear search') }}">✕</a>
            @endif
        </form>
    </div>
</div>
