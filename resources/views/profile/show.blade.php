<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('My Profile') }}</h2>
    </x-slot>

    <div class="py-8">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            {{-- Profile Information --}}
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-base font-semibold text-gray-900 mb-5">{{ __('Profile Information') }}</h3>

                @if(session('success'))
                    <div class="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                        {{ session('success') }}
                    </div>
                @endif

                @php $profileErrors = collect(['name','email','phone','avatar'])->flatMap(fn($f) => $errors->get($f))->filter(); @endphp
                @if($profileErrors->isNotEmpty())
                    <div class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <ul class="text-sm text-red-600 space-y-1">
                            @foreach($profileErrors as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form action="{{ route('profile.update') }}" method="POST" enctype="multipart/form-data"
                      x-data="{
                          previewUrl: '{{ $user->avatar ? asset('storage/' . $user->avatar) : '' }}',
                          _file: null,

                          init() {
                              this.$el.addEventListener('submit', () => {
                                  if (this._file) {
                                      const dt = new DataTransfer();
                                      dt.items.add(this._file);
                                      this.$refs.avatarInput.files = dt.files;
                                  }
                              }, true);
                          },

                          async onFile(e) {
                              const file = e.target.files[0];
                              if (!file) return;
                              const ready = file.size > 1.8 * 1024 * 1024
                                  ? await this._compress(file)
                                  : file;
                              this._file = ready;
                              this.previewUrl = URL.createObjectURL(ready);
                              e.target.value = '';
                          },

                          _compress(file) {
                              return new Promise(resolve => {
                                  const reader = new FileReader();
                                  reader.onload = e => {
                                      const img = new Image();
                                      img.onload = () => {
                                          const canvas = document.createElement('canvas');
                                          let w = img.width, h = img.height;
                                          if (w > 1920) { h = Math.round(h * 1920 / w); w = 1920; }
                                          canvas.width = w; canvas.height = h;
                                          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                          const MAX = 1.8 * 1024 * 1024;
                                          let q = 0.85;
                                          (function attempt() {
                                              canvas.toBlob(blob => {
                                                  if (blob.size > MAX && q > 0.2) { q = Math.round((q - 0.1) * 10) / 10; attempt(); }
                                                  else resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
                                              }, 'image/jpeg', q);
                                          })();
                                      };
                                      img.src = e.target.result;
                                  };
                                  reader.readAsDataURL(file);
                              });
                          },

                          removeAvatar() {
                              this.previewUrl = '';
                              this._file = null;
                              this.$refs.avatarInput.value = '';
                          }
                      }">
                    @csrf
                    @method('PUT')

                    {{-- Avatar --}}
                    <div class="flex items-center gap-5 mb-6">
                        <div class="relative shrink-0">
                            <template x-if="previewUrl">
                                <img :src="previewUrl"
                                     class="w-20 h-20 rounded-full object-cover border-2 border-gray-200">
                            </template>
                            <template x-if="!previewUrl">
                                <div class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-gray-200">
                                    <span class="text-3xl font-bold text-indigo-600">
                                        {{ strtoupper(substr($user->name, 0, 1)) }}
                                    </span>
                                </div>
                            </template>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                                          bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit">
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                                </svg>
                                {{ __('Upload photo') }}
                                <input type="file" name="avatar" accept="image/*" class="hidden"
                                       x-ref="avatarInput" @change="onFile($event)">
                            </label>
                            @if($user->avatar)
                                <button type="button" @click="removeAvatar()"
                                        class="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 w-fit">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                    {{ __('Remove photo') }}
                                </button>
                                <input type="hidden" name="remove_avatar" x-bind:value="previewUrl ? '0' : '1'">
                            @endif
                            <p class="text-xs text-gray-400">JPEG, PNG, GIF — max 4 MB</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Full name') }}</label>
                            <input type="text" name="name" value="{{ old('name', $user->name) }}" required
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            @error('name') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Email address') }}</label>
                            <input type="email" name="email" value="{{ old('email', $user->email) }}" required
                                   class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            @error('email') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                        </div>
                    </div>

                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Phone number') }}</label>
                        <input type="text" name="phone" value="{{ old('phone', $user->phone) }}" maxlength="20"
                               placeholder="+1 234 567 890"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        @error('phone') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <x-button type="submit">{{ __('Save changes') }}</x-button>
                </form>
            </div>

            {{-- Change Password --}}
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 class="text-base font-semibold text-gray-900 mb-5">{{ __('Change Password') }}</h3>

                @if(session('password_success'))
                    <div class="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                        {{ session('password_success') }}
                    </div>
                @endif

                @php $passwordErrors = collect(['current_password','password'])->flatMap(fn($f) => $errors->get($f))->filter(); @endphp
                @if($passwordErrors->isNotEmpty())
                    <div class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <ul class="text-sm text-red-600 space-y-1">
                            @foreach($passwordErrors as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form action="{{ route('profile.password') }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Current password') }}</label>
                        <input type="password" name="current_password" required autocomplete="current-password"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        @error('current_password') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('New password') }}</label>
                        <input type="password" name="password" required autocomplete="new-password" minlength="8"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        @error('password') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div class="mb-5">
                        <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Confirm new password') }}</label>
                        <input type="password" name="password_confirmation" required autocomplete="new-password"
                               class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>

                    <x-button type="submit">{{ __('Change password') }}</x-button>
                </form>
            </div>

        </div>
    </div>
</x-app-layout>
