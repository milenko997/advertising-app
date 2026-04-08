<div class="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
    <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold shrink-0">
        {{ strtoupper(substr($user->name, 0, 1)) }}
    </div>
    <div class="min-w-0">
        <p class="font-medium text-gray-900 text-sm truncate">{{ $user->name }}</p>
        <p class="text-xs text-gray-400 truncate">{{ $user->email }}</p>
    </div>
</div>
