<nav x-data="{ open: false }" class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

            {{-- Left: Logo + links --}}
            <div class="flex items-center gap-8">
                <a href="{{ route('home') }}" class="shrink-0 text-xl font-bold text-indigo-600 tracking-tight">
                    AdBoard
                </a>

                <div class="hidden sm:flex items-center gap-1">
                    <x-nav-link :href="route('home')" :active="request()->routeIs('home')">
                        {{ __('Home') }}
                    </x-nav-link>

                    @auth
                        @if(auth()->user()->isAdmin())
                            <x-nav-link :href="route('admin.advertisements.index')" :active="request()->routeIs('admin.advertisements.*')">
                                {{ __('Advertisements') }}
                            </x-nav-link>
                            <x-nav-link :href="route('admin.categories.index')" :active="request()->routeIs('admin.categories.*')">
                                {{ __('Categories') }}
                            </x-nav-link>
                            <x-nav-link :href="route('admin.customers.index')" :active="request()->routeIs('admin.customers.*')">
                                {{ __('Customers') }}
                            </x-nav-link>
                        @else
                            <x-nav-link :href="route('advertisements.user')" :active="request()->routeIs('advertisements.user')">
                                {{ __('My Ads') }}
                            </x-nav-link>
                            <x-nav-link :href="route('advertisements.create')" :active="request()->routeIs('advertisements.create')">
                                {{ __('Post Ad') }}
                            </x-nav-link>
                            <x-nav-link :href="route('advertisements.trash')" :active="request()->routeIs('advertisements.trash')">
                                {{ __('Trash') }}
                            </x-nav-link>
                        @endif
                    @endauth
                </div>
            </div>

            {{-- Right: User menu / auth links --}}
            <div class="hidden sm:flex items-center">
                @auth
                    <x-dropdown align="right" width="48">
                        <x-slot name="trigger">
                            <button class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none transition">
                                <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                    {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                                </span>
                                <span>{{ Auth::user()->name }}</span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                        </x-slot>
                        <x-slot name="content">
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <x-dropdown-link :href="route('logout')"
                                    onclick="event.preventDefault(); this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </x-dropdown-link>
                            </form>
                        </x-slot>
                    </x-dropdown>
                @else
                    <div class="flex items-center gap-4">
                        <a href="{{ route('login') }}" class="text-sm font-medium text-gray-600 hover:text-gray-900">
                            {{ __('Log in') }}
                        </a>
                        @if(Route::has('register'))
                            <a href="{{ route('register') }}"
                               class="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                                {{ __('Register') }}
                            </a>
                        @endif
                    </div>
                @endauth
            </div>

            {{-- Mobile hamburger --}}
            <button @click="open = !open"
                    class="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path :class="{'hidden': open, 'inline-flex': !open}" class="inline-flex"
                          stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    <path :class="{'hidden': !open, 'inline-flex': open}" class="hidden"
                          stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    </div>

    {{-- Mobile menu --}}
    <div :class="{'block': open, 'hidden': !open}" class="hidden sm:hidden border-t border-gray-200 bg-gray-50">
        <div class="px-4 py-3 space-y-1">
            <x-responsive-nav-link :href="route('home')" :active="request()->routeIs('home')">
                {{ __('Home') }}
            </x-responsive-nav-link>
            @auth
                @if(auth()->user()->isAdmin())
                    <x-responsive-nav-link :href="route('admin.advertisements.index')">{{ __('Advertisements') }}</x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('admin.categories.index')">{{ __('Categories') }}</x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('admin.customers.index')">{{ __('Customers') }}</x-responsive-nav-link>
                @else
                    <x-responsive-nav-link :href="route('advertisements.user')">{{ __('My Ads') }}</x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('advertisements.create')">{{ __('Post Ad') }}</x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('advertisements.trash')">{{ __('Trash') }}</x-responsive-nav-link>
                @endif
            @endauth
        </div>
        @auth
            <div class="px-4 py-3 border-t border-gray-200">
                <p class="text-sm font-semibold text-gray-800">{{ Auth::user()->name }}</p>
                <p class="text-xs text-gray-500">{{ Auth::user()->email }}</p>
                <form method="POST" action="{{ route('logout') }}" class="mt-2">
                    @csrf
                    <x-responsive-nav-link :href="route('logout')"
                        onclick="event.preventDefault(); this.closest('form').submit();">
                        {{ __('Log Out') }}
                    </x-responsive-nav-link>
                </form>
            </div>
        @endauth
    </div>
</nav>
