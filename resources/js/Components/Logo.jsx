/**
 * Unified Transporteri logo — orange rounded square with truck icon + TRANSPORTERI text.
 * The text uses fill="currentColor", so set the text colour via a CSS color class on the
 * parent element (e.g. className="text-white" or "text-gray-900 dark:text-white").
 */
export default function Logo({ height = 36, className = '' }) {
    return (
        <svg
            viewBox="0 0 180 36"
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Transporteri"
            className={className}
            style={{ display: 'block', width: 'auto' }}
        >
            {/* Orange rounded square */}
            <rect width="36" height="36" rx="8" fill="#ea580c" />

            {/* Truck icon — original 24×24 path scaled to 22×22 and centered in the 36×36 box */}
            <g transform="translate(7 7) scale(0.917)">
                <path
                    fill="white"
                    d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34
                       3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6
                       18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5
                       1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5
                       9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5
                       1.5-.67 1.5-1.5 1.5z"
                />
            </g>

            {/* TRANSPORTERI text — textLength pins the width so rendering is consistent */}
            <text
                x="48"
                y="24"
                fill="currentColor"
                fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
                fontSize="16"
                fontWeight="800"
                textLength="130"
                lengthAdjust="spacing"
            >
                TRANSPORTERI
            </text>
        </svg>
    );
}
