{{-- Usage: @include('partials.image-upload', ['current' => $ad->image ?? null]) --}}

<div class="mb-4">
    @if(!empty($current))
        <label class="block font-medium text-sm text-gray-700 mb-1">{{ __('Current Image') }}</label>
        <img src="{{ asset('storage/' . $current) }}" alt="Current image" class="w-48 h-auto rounded shadow mb-3">
        <label class="block font-medium text-sm text-gray-700 mb-1">{{ __('Change Image') }}</label>
    @else
        <label class="block font-medium text-sm text-gray-700 mb-1">{{ __('Image') }}</label>
    @endif

    <input
        type="file"
        name="image"
        id="image-upload-input"
        accept="image/jpeg,image/png,image/gif,image/svg+xml"
        class="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
               file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
    <p id="image-upload-status" class="text-sm text-indigo-600 mt-1 hidden"></p>

    @error('image')
        <div class="text-red-600 text-sm mt-1">{{ $message }}</div>
    @enderror
</div>

<script>
(function () {
    const MAX_BYTES = 1.8 * 1024 * 1024; // target under PHP's 2 MB limit

    function compressImage(file, callback) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;

                if (w > 1920) {
                    h = Math.round(h * 1920 / w);
                    w = 1920;
                }

                canvas.width  = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);

                let quality = 0.85;
                (function tryEncode() {
                    canvas.toBlob(function (blob) {
                        if (blob.size > MAX_BYTES && quality > 0.2) {
                            quality = Math.round((quality - 0.1) * 10) / 10;
                            tryEncode();
                        } else {
                            const compressed = new File(
                                [blob],
                                file.name.replace(/\.[^.]+$/, '.jpg'),
                                { type: 'image/jpeg' }
                            );
                            callback(compressed, blob.size);
                        }
                    }, 'image/jpeg', quality);
                })();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    const input  = document.getElementById('image-upload-input');
    const status = document.getElementById('image-upload-status');

    // Intercept form submit to compress first if needed
    input.closest('form').addEventListener('submit', function (e) {
        const file = input.files[0];
        if (!file || file.size <= MAX_BYTES) return; // no compression needed

        e.preventDefault();
        const form = this;

        status.textContent = 'Compressing image…';
        status.classList.remove('hidden');

        compressImage(file, function (compressed, finalSize) {
            const dt = new DataTransfer();
            dt.items.add(compressed);
            input.files = dt.files;

            const kb = Math.round(finalSize / 1024);
            status.textContent = 'Compressed to ' + kb + ' KB. Uploading…';

            form.submit();
        });
    });

    // Show live file size when a file is selected
    input.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) { status.classList.add('hidden'); return; }
        const mb = (file.size / 1024 / 1024).toFixed(1);
        status.textContent = file.size > MAX_BYTES
            ? 'File is ' + mb + ' MB — will be compressed before upload.'
            : 'File is ' + mb + ' MB.';
        status.classList.remove('hidden');
    });
})();
</script>
