'use client';
import { useEffect, useRef } from 'react';

export default function ScrollReveal({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 600,
    threshold = 0.15,
    className = '',
    as: Tag = 'div',
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.transitionDelay = `${delay}ms`;
        el.style.transitionDuration = `${duration}ms`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, duration, threshold]);

    return (
        <Tag ref={ref} className={`scroll-reveal ${animation} ${className}`}>
            {children}
        </Tag>
    );
}
