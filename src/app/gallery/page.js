'use client';

import { useState } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './gallery.module.css';

const DEMO_IMAGES = [
    { id: 1, title: 'Stage Setup', category: 'decoration', url: '🎪' },
    { id: 2, title: 'Dance Rehearsal', category: 'rehearsal', url: '💃' },
    { id: 3, title: 'Singing Practice', category: 'rehearsal', url: '🎤' },
    { id: 4, title: 'Decoration Work', category: 'decoration', url: '🎨' },
    { id: 5, title: 'Team Meeting', category: 'backstage', url: '👥' },
    { id: 6, title: 'Sound Check', category: 'backstage', url: '🔊' },
    { id: 7, title: 'Drama Rehearsal', category: 'rehearsal', url: '🎭' },
    { id: 8, title: 'Banner Design', category: 'decoration', url: '🖼️' },
    { id: 9, title: 'Fashion Prep', category: 'backstage', url: '👗' },
];

export default function GalleryPage() {
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState(null);

    const categories = ['all', 'decoration', 'rehearsal', 'backstage'];
    const filtered = filter === 'all' ? DEMO_IMAGES : DEMO_IMAGES.filter(img => img.category === filter);

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2>🖼️ Gallery</h2>
                            <p>Moments captured from preparations and the event</p>
                        </div>
                    </ScrollReveal>

                    <div className="tabs" style={{ justifyContent: 'center', margin: '0 auto 40px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`tab ${filter === cat ? 'active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat === 'all' ? '🌟 All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className={styles.galleryGrid}>
                        {filtered.map((img, i) => (
                            <ScrollReveal animation="scale-in" delay={(i % 6) * 80} key={img.id}>
                                <div
                                    className={styles.galleryItem}
                                    onClick={() => setSelected(img)}
                                >
                                    <div className={styles.galleryPlaceholder}>
                                        <span className={styles.galleryEmoji}>{img.url}</span>
                                    </div>
                                    <div className={styles.galleryOverlay}>
                                        <span className={styles.galleryTitle}>{img.title}</span>
                                        <span className={`badge badge-primary`}>{img.category}</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <div className={styles.galleryNote}>
                        <div className="alert alert-info">
                            📸 Photos and videos will be uploaded here during and after the event. Stay tuned!
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selected.title}</h3>
                            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <div className={styles.lightboxContent}>
                            <span style={{ fontSize: '6rem' }}>{selected.url}</span>
                            <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Category: {selected.category}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
