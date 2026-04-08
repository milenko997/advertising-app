@foreach($ads as $ad)
    <a href="{{ route('advertisements.show', $ad->slug) }}"
       class="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all flex flex-col">

        @if($ad->image)
            <div class="aspect-video overflow-hidden bg-gray-100 shrink-0">
                <img src="{{ asset('storage/' . $ad->image) }}"
                     alt="{{ $ad->title }}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
        @else
            <div class="aspect-video bg-gray-100 flex items-center justify-center shrink-0">
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </div>
        @endif

        <div class="p-4 flex flex-col flex-1">
            <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {{ $ad->title }}
                </h3>
                <span class="text-indigo-600 font-bold shrink-0">{{ $ad->price }}</span>
            </div>

            <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ $ad->description }}</p>

            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-auto">
                <span class="inline-flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                    {{ $ad->category->name }}
                </span>
                <span class="inline-flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ $ad->location }}
                </span>
                <span class="ml-auto">{{ $ad->created_at->format('d.m.Y') }}</span>
            </div>

            @if($ad->condition)
                <span class="inline-block mt-2 px-2 py-0.5 text-xs rounded-full w-fit
                    {{ $ad->condition === 'new' || $ad->condition === 'New' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700' }}">
                    {{ ucfirst($ad->condition) }}
                </span>
            @endif
        </div>
    </a>
@endforeach
