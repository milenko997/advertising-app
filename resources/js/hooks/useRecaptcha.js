import { useCallback } from 'react';

export function useRecaptcha(action) {
    return useCallback(async () => {
        if (!window.grecaptcha || !window.recaptchaSiteKey) return '';
        return new Promise((resolve) => {
            window.grecaptcha.ready(async () => {
                try {
                    const token = await window.grecaptcha.execute(window.recaptchaSiteKey, { action });
                    resolve(token);
                } catch {
                    resolve('');
                }
            });
        });
    }, [action]);
}
