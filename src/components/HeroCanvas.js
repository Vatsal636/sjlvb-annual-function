'use client';

import { useEffect, useRef, useCallback } from 'react';

const COLORS = [
    [124, 111, 224],  // purple
    [240, 166, 202],  // pink
    [119, 201, 212],  // teal
    [245, 201, 126],  // gold
    [126, 203, 161],  // green
    [232, 123, 123],  // coral
];

export default function HeroCanvas() {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: -1000, y: -1000 });
    const particles = useRef([]);
    const animFrame = useRef(null);
    const burstQueue = useRef([]);

    const createParticle = useCallback((w, h, opts = {}) => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
            x: opts.x ?? Math.random() * w,
            y: opts.y ?? Math.random() * h,
            vx: (Math.random() - 0.5) * (opts.speed ?? 0.8),
            vy: (Math.random() - 0.5) * (opts.speed ?? 0.8),
            radius: opts.radius ?? 1.5 + Math.random() * 3,
            color,
            alpha: opts.alpha ?? 0.3 + Math.random() * 0.5,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            life: opts.life ?? Infinity,
            maxLife: opts.life ?? Infinity,
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);
            return { w: rect.width, h: rect.height };
        };

        let { w, h } = resize();

        // Create initial particles
        const count = Math.min(120, Math.floor((w * h) / 8000));
        particles.current = Array.from({ length: count }, () => createParticle(w, h));

        // Mouse tracking
        const onMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
        };
        const onMouseLeave = () => {
            mouse.current.x = -1000;
            mouse.current.y = -1000;
        };

        // Click burst
        const onClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            for (let i = 0; i < 25; i++) {
                const angle = (Math.PI * 2 * i) / 25 + (Math.random() - 0.5) * 0.5;
                const speed = 2 + Math.random() * 4;
                particles.current.push(createParticle(w, h, {
                    x: cx,
                    y: cy,
                    speed: 0,
                    radius: 1 + Math.random() * 2.5,
                    alpha: 0.9,
                    life: 60 + Math.random() * 40,
                }));
                const p = particles.current[particles.current.length - 1];
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
            }
        };

        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', onMouseLeave);
        canvas.addEventListener('click', onClick);

        // Touch support
        const onTouch = (e) => {
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            if (touch) {
                mouse.current.x = touch.clientX - rect.left;
                mouse.current.y = touch.clientY - rect.top;
            }
        };
        canvas.addEventListener('touchmove', onTouch, { passive: true });
        canvas.addEventListener('touchend', onMouseLeave);

        const onResize = () => {
            const dims = resize();
            w = dims.w;
            h = dims.h;
        };
        window.addEventListener('resize', onResize);

        // Shooting stars
        const shootingStars = [];
        const spawnStar = () => {
            shootingStars.push({
                x: Math.random() * w * 0.6,
                y: Math.random() * h * 0.3,
                vx: 4 + Math.random() * 6,
                vy: 2 + Math.random() * 3,
                tail: [],
                life: 40 + Math.random() * 30,
                maxLife: 40 + Math.random() * 30,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
        };

        let starTimer = 0;

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, w, h);

            const mx = mouse.current.x;
            const my = mouse.current.y;

            // Update & draw particles
            particles.current = particles.current.filter(p => {
                // Update
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += p.pulseSpeed;

                // Life decay for burst particles
                if (p.life !== Infinity) {
                    p.life--;
                    if (p.life <= 0) return false;
                    p.alpha = (p.life / p.maxLife) * 0.9;
                    p.vx *= 0.96;
                    p.vy *= 0.96;
                }

                // Bounce off edges
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                p.x = Math.max(0, Math.min(w, p.x));
                p.y = Math.max(0, Math.min(h, p.y));

                // Mouse interaction — particles are attracted softly
                const dx = mx - p.x;
                const dy = my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200 && dist > 5) {
                    const force = 0.015;
                    p.vx += (dx / dist) * force * (200 - dist) * 0.1;
                    p.vy += (dy / dist) * force * (200 - dist) * 0.1;
                }

                // Speed limit
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 3) {
                    p.vx = (p.vx / speed) * 3;
                    p.vy = (p.vy / speed) * 3;
                }

                // Draw
                const r = p.radius * (1 + Math.sin(p.pulse) * 0.3);
                const glowAlpha = p.alpha * 0.4;

                // Glow
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
                glow.addColorStop(0, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${glowAlpha})`);
                glow.addColorStop(1, `rgba(${p.color[0]},${p.color[1]},${p.color[2]},0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fill();

                return true;
            });

            // Draw connection lines between nearby particles
            const pts = particles.current;
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.12;
                        ctx.strokeStyle = `rgba(${pts[i].color[0]},${pts[i].color[1]},${pts[i].color[2]},${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Mouse attraction ring
            if (mx > 0 && my > 0) {
                const ring = ctx.createRadialGradient(mx, my, 0, mx, my, 160);
                ring.addColorStop(0, 'rgba(124, 111, 224, 0.06)');
                ring.addColorStop(0.5, 'rgba(240, 166, 202, 0.03)');
                ring.addColorStop(1, 'transparent');
                ctx.fillStyle = ring;
                ctx.beginPath();
                ctx.arc(mx, my, 160, 0, Math.PI * 2);
                ctx.fill();
            }

            // Shooting stars
            starTimer++;
            if (starTimer > 120 + Math.random() * 200) {
                spawnStar();
                starTimer = 0;
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.tail.push({ x: s.x, y: s.y });
                if (s.tail.length > 12) s.tail.shift();
                s.x += s.vx;
                s.y += s.vy;
                s.life--;

                const progress = s.life / s.maxLife;

                // Draw tail
                for (let t = 0; t < s.tail.length; t++) {
                    const a = (t / s.tail.length) * progress * 0.5;
                    const tr = (t / s.tail.length) * 2.5;
                    ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a})`;
                    ctx.beginPath();
                    ctx.arc(s.tail[t].x, s.tail[t].y, tr, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Draw head
                ctx.fillStyle = `rgba(255,255,255,${progress * 0.9})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
                ctx.fill();

                if (s.life <= 0 || s.x > w || s.y > h) {
                    shootingStars.splice(i, 1);
                }
            }

            animFrame.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animFrame.current);
            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseleave', onMouseLeave);
            canvas.removeEventListener('click', onClick);
            canvas.removeEventListener('touchmove', onTouch);
            canvas.removeEventListener('touchend', onMouseLeave);
            window.removeEventListener('resize', onResize);
        };
    }, [createParticle]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
            }}
        />
    );
}
