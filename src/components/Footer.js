import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>🎭 SJLVB & SJLKC Annual Function</h3>
                        <p>March 15, 2026 — A day of talent, togetherness, and celebration.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/schedule">Schedule</Link></li>
                            <li><Link href="/events">Events</Link></li>
                            <li><Link href="/gallery">Gallery</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>More</h4>
                        <ul>
                            <li><Link href="/feedback">Feedback</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 SJLVB & SJLKC Annual Function. Made with ❤️</p>
                </div>
            </div>
        </footer>
    );
}
