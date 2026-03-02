'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const NAV_LINKS = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/schedule', label: 'Schedule', icon: '📅' },
    { href: '/events', label: 'Events', icon: '🎭' },
    { href: '/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/feedback', label: 'Feedback', icon: '💬' },
    { href: '/contact', label: 'Contact', icon: '📞' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoverIdx, setHoverIdx] = useState(-1);
    const [pillStyle, setPillStyle] = useState({});
    const linksRef = useRef([]);
    const navInnerRef = useRef(null);
    const linksContainerRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    // Sliding pill indicator for active/hovered link
    useEffect(() => {
        const targetIdx = hoverIdx >= 0 ? hoverIdx : NAV_LINKS.findIndex(l => l.href === pathname);
        const el = linksRef.current[targetIdx];
        const container = linksContainerRef.current;
        if (el && container) {
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            setPillStyle({
                width: (elRect.width + 8) + 'px',
                left: (elRect.left - containerRect.left - 4) + 'px',
                opacity: 1,
            });
        } else {
            setPillStyle({ opacity: 0 });
        }
    }, [hoverIdx, pathname]);

    const activeIdx = NAV_LINKS.findIndex(l => l.href === pathname);

    return (
        <>
            {/* Floating Navbar */}
            <nav className={`unav ${scrolled ? 'unav--scrolled' : ''}`}>
                <div className="unav__glow"></div>
                <div className="unav__border"></div>
                <div className="unav__inner" ref={navInnerRef}>
                    {/* Logo */}
                    <Link href="/" className="unav__logo">
                        <div className="unav__logo-orb">
                            <span className="unav__logo-text">AF</span>
                            <div className="unav__logo-ring"></div>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="unav__links" ref={linksContainerRef}>
                        <div className="unav__pill" style={pillStyle}></div>
                        {NAV_LINKS.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                ref={el => linksRef.current[i] = el}
                                className={`unav__link ${pathname === link.href ? 'unav__link--active' : ''}`}
                                onMouseEnter={() => setHoverIdx(i)}
                                onMouseLeave={() => setHoverIdx(-1)}
                            >
                                <span className="unav__link-label">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* CTA removed for Informative Site Only */}

                    {/* Mobile Toggle */}
                    <button
                        className={`unav__toggle ${menuOpen ? 'unav__toggle--open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Fullscreen Menu */}
            <div className={`umenu ${menuOpen ? 'umenu--open' : ''}`}>
                <div className="umenu__bg">
                    <div className="umenu__circle umenu__circle--1"></div>
                    <div className="umenu__circle umenu__circle--2"></div>
                    <div className="umenu__circle umenu__circle--3"></div>
                </div>
                <div className="umenu__content">
                    <div className="umenu__brand">
                        <div className="umenu__brand-orb">AF</div>
                        <div>
                            <div className="umenu__brand-name">SJLVB & SJLKC</div>
                            <div className="umenu__brand-sub">Annual Function 2026</div>
                        </div>
                    </div>
                    <div className="umenu__links">
                        {NAV_LINKS.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`umenu__link ${pathname === link.href ? 'umenu__link--active' : ''}`}
                                style={{ animationDelay: `${0.05 * i}s` }}
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className="umenu__link-icon">{link.icon}</span>
                                <span className="umenu__link-label">{link.label}</span>
                                <span className="umenu__link-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                    {/* Mobile CTA removed for Informative Site Only */}
                </div>
            </div>
        </>
    );
}
