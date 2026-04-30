import { useState, useEffect, useCallback, useRef } from 'react';

export default function ImageCarousel({ images, initialIndex = 0, onClose }) {
    const [current, setCurrent] = useState(initialIndex);
    const [fading, setFading] = useState(false);
    const [dragDelta, setDragDelta] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const closeButtonRef = useRef(null);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const mouseStartX = useRef(null);
    const didSwipe = useRef(false);

    // Fade transition — used for button / keyboard / dot navigation
    const goTo = useCallback((newIndex) => {
        setFading(true);
        setTimeout(() => {
            setCurrent(newIndex);
            setFading(false);
        }, 150);
    }, []);

    const prev = useCallback(() => goTo((current - 1 + images.length) % images.length), [current, images.length, goTo]);
    const next = useCallback(() => goTo((current + 1) % images.length), [current, images.length, goTo]);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowLeft') prev();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next, onClose]);

    useEffect(() => {
        const trigger = document.activeElement;
        closeButtonRef.current?.focus();
        return () => { trigger?.focus(); };
    }, []);

    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    // ── Touch ──────────────────────────────────────────────────────────────
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX;
        touchStartY.current = e.changedTouches[0].clientY;
        didSwipe.current = false;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null;
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            didSwipe.current = true;
            if (deltaX < 0) next();
            else prev();
        }
    };

    // ── Mouse drag ─────────────────────────────────────────────────────────
    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        mouseStartX.current = e.clientX;
        setIsDragging(true);
        didSwipe.current = false;
    };

    const handleMouseMove = (e) => {
        if (!mouseStartX.current) return;
        setDragDelta(e.clientX - mouseStartX.current);
    };

    // Commit: navigate if threshold exceeded, then snap image back to center
    const commitDrag = (clientX) => {
        if (!mouseStartX.current) return;
        const delta = clientX - mouseStartX.current;
        mouseStartX.current = null;
        setIsDragging(false);
        setDragDelta(0);
        if (Math.abs(delta) > 60) {
            didSwipe.current = true;
            setCurrent(i => delta < 0
                ? (i + 1) % images.length
                : (i - 1 + images.length) % images.length
            );
        }
    };

    // Cancel: just snap back without navigating
    const cancelDrag = () => {
        if (!mouseStartX.current) return;
        mouseStartX.current = null;
        setIsDragging(false);
        setDragDelta(0);
    };

    const clampedDelta = Math.max(-120, Math.min(120, dragDelta));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 !mt-0 select-none"
            style={{ cursor: isDragging ? 'grabbing' : images.length > 1 ? 'grab' : 'default' }}
            onClick={() => { if (!didSwipe.current) onClose(); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={e => commitDrag(e.clientX)}
            onMouseLeave={cancelDrag}
        >
            {/* Close */}
            <button
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition z-10"
                aria-label="Zatvori"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
                    {current + 1} / {images.length}
                </div>
            )}

            {/* Prev */}
            {images.length > 1 && (
                <button
                    onClick={e => { e.stopPropagation(); prev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/10 z-10"
                    aria-label="Prethodna slika"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Image */}
            <img
                src={`/storage/${images[current].path ?? images[current]}`}
                alt={`Image ${current + 1}`}
                draggable={false}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                style={{
                    opacity: fading ? 0 : 1,
                    transform: `translateX(${clampedDelta}px)`,
                    transition: isDragging
                        ? 'none'
                        : 'opacity 150ms ease, transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    pointerEvents: 'none',
                }}
            />

            {/* Next */}
            {images.length > 1 && (
                <button
                    onClick={e => { e.stopPropagation(); next(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-2 rounded-full hover:bg-white/10 z-10"
                    aria-label="Sledeća slika"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={e => { e.stopPropagation(); goTo(i); }}
                            className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
                            aria-label={`Go to image ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
