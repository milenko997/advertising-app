import { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export function StarRating({ value, onChange, readOnly = false }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    aria-label={`${star} od 5 zvezda`}
                    onClick={() => !readOnly && onChange?.(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    className={`w-5 h-5 transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className={`w-full h-full transition-colors ${star <= display ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor"
                    >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

export function ReviewCard({ review, variant = 'card' }) {
    const isList = variant === 'list';
    const avatarSize = isList ? 'w-8 h-8' : 'w-9 h-9';

    return (
        <div className={isList
            ? 'flex flex-col gap-3 py-4 border-b border-gray-100 last:border-0'
            : 'bg-white rounded-xl border border-gray-200 p-5'
        }>
            <div className={`flex items-start justify-between ${isList ? 'gap-3' : 'gap-4'}`}>
                <div className={`flex items-center ${isList ? 'gap-2.5' : 'gap-3'}`}>
                    <div className={`${avatarSize} rounded-full bg-orange-100 flex items-center justify-center shrink-0`}>
                        {review.reviewer.avatar ? (
                            <img
                                src={`/storage/${review.reviewer.avatar}`}
                                alt={review.reviewer.name}
                                className={`${avatarSize} rounded-full object-cover`}
                            />
                        ) : (
                            <span className={`text-orange-600 font-bold ${isList ? 'text-xs' : 'text-sm'}`}>
                                {review.reviewer.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        {review.reviewer.slug ? (
                            <Link
                                href={`/korisnik/${review.reviewer.slug}`}
                                className="text-sm font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                            >
                                {review.reviewer.name}
                            </Link>
                        ) : (
                            <span className="text-sm font-semibold text-gray-400">{review.reviewer.name}</span>
                        )}
                        <p className="text-xs text-gray-400">{review.created_at}</p>
                    </div>
                </div>
                <StarRating value={review.rating} readOnly />
            </div>
            {review.comment && (
                <p className={`${isList ? '' : 'mt-3'} text-sm text-gray-600 leading-relaxed`}>{review.comment}</p>
            )}
        </div>
    );
}

// variant="minimal" — inline form inside ad Show page (no card border)
// variant="card"    — standalone card on user profile page
export function ReviewForm({ userSlug, variant = 'card' }) {
    const isMinimal = variant === 'minimal';
    const [rating, setRating]       = useState(0);
    const [comment, setComment]     = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (!rating) { setError('Molimo odaberite ocenu zvezdicama.'); return; }
        setError('');
        setSubmitting(true);
        router.post(`/korisnik/${userSlug}/recenzije`, { rating, comment }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <form
            onSubmit={submit}
            className={isMinimal
                ? 'mt-4 pt-4 border-t border-gray-100'
                : 'bg-white rounded-xl border border-gray-200 p-5'
            }
        >
            <h4 className={isMinimal
                ? 'text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'
                : 'text-sm font-semibold text-gray-700 mb-4'
            }>
                Ostavi recenziju
            </h4>

            <div className={isMinimal ? 'mb-3' : 'mb-4'}>
                {!isMinimal && (
                    <label className="block text-xs font-medium text-gray-500 mb-2">Tvoja ocena</label>
                )}
                <StarRating value={rating} onChange={setRating} />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            <div className={isMinimal ? '' : 'mb-4'}>
                {!isMinimal && (
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Komentar <span className="text-gray-400">(opciono)</span>
                    </label>
                )}
                <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={1000}
                    placeholder="Podelite vaše iskustvo… (opciono)"
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${isMinimal ? 'mb-3' : ''}`}
                />
                {!isMinimal && (
                    <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/1000</p>
                )}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className={`bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50 ${isMinimal ? 'px-4 py-2' : 'px-5 py-2'}`}
            >
                {submitting ? 'Slanje…' : 'Pošalji recenziju'}
            </button>
        </form>
    );
}
