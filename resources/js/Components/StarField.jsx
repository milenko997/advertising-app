import { useEffect, useRef } from 'react';

export default function StarField() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;

        const STAR_COUNT = 120;
        const MAX_DIST = 150;
        const SPEED = 0.4;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const stars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r: Math.random() * 2.5 + 1.5,
        }));

        const draw = () => {
            const isDark = document.documentElement.classList.contains('dark');
            const starColor = isDark ? 'rgba(255,255,255,' : 'rgba(20,20,30,';
            const lineColor = isDark ? 'rgba(255,255,255,' : 'rgba(20,20,30,';

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const s of stars) {
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < 0) s.x = canvas.width;
                if (s.x > canvas.width) s.x = 0;
                if (s.y < 0) s.y = canvas.height;
                if (s.y > canvas.height) s.y = 0;
            }

            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * (isDark ? 0.35 : 0.55);
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor + alpha + ')';
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }

            for (const s of stars) {
                ctx.beginPath();
                ctx.fillStyle = starColor + '0.7)';
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        />
    );
}
