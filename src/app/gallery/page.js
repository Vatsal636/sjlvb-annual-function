'use client';

import { useState, useEffect, useCallback } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './gallery.module.css';

const CLOUD_NAME = 'dgjy5jlyp';
const TAG = 'annual';

function getCloudinaryUrl(publicId, format, transforms = '') {
    const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
    return transforms
        ? `${base}/${transforms}/${publicId}.${format}`
        : `${base}/${publicId}.${format}`;
}

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG}.json`)
            .then(r => r.json())
            .then(data => {
                const resources = data.resources || [];
                const mapped = resources.map(img => ({
                    publicId: img.public_id,
                    format: img.format,
                    width: img.width,
                    height: img.height,
                    createdAt: img.created_at,
                    thumb: getCloudinaryUrl(img.public_id, img.format, 'w_500,h_500,c_fill,q_auto,f_auto'),
                    full: getCloudinaryUrl(img.public_id, img.format, 'w_1400,q_auto,f_auto'),
                }));
                setImages(mapped);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const openLightbox = (index) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goNext = useCallback(() => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % images.length);
        }
    }, [selectedIndex, images.length]);

    const goPrev = useCallback(() => {
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
        }
    }, [selectedIndex, images.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (selectedIndex === null) return;
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedIndex, goNext, goPrev]);

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2><span className="section-icon">🖼️</span> Gallery</h2>
                            <p>Moments captured from the event</p>
                        </div>
                    </ScrollReveal>

                    {loading ? (
                        <div className="empty-state"><p>Loading gallery...</p></div>
                    ) : images.length === 0 ? (
                        <div className={styles.emptyGallery}>
                            <div className={styles.emptyIcon}>📸</div>
                            <h3>Photos Coming Soon!</h3>
                            <p>Photos and videos will be uploaded here during and after the event. Stay tuned!</p>
                        </div>
                    ) : (
                        <>
                            <p className={styles.photoCount}>{images.length} photo{images.length !== 1 ? 's' : ''}</p>
                            <div className={styles.galleryGrid}>
                                {images.map((img, i) => (
                                    <ScrollReveal animation="scale-in" delay={(i % 9) * 60} key={img.publicId}>
                                        <div
                                            className={styles.galleryItem}
                                            onClick={() => openLightbox(i)}
                                        >
                                            <img
                                                src={img.thumb}
                                                alt={`Event photo ${i + 1}`}
                                                className={styles.galleryImage}
                                                loading="lazy"
                                            />
                                            <div className={styles.galleryOverlay}>
                                                <span className={styles.zoomIcon}>🔍</span>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {selectedIndex !== null && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.lightboxClose} onClick={closeLightbox}>✕</button>

                    <button
                        className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    >
                        ‹
                    </button>

                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[selectedIndex].full}
                            alt={`Event photo ${selectedIndex + 1}`}
                            className={styles.lightboxImage}
                        />
                        <p className={styles.lightboxCounter}>
                            {selectedIndex + 1} / {images.length}
                        </p>
                    </div>

                    <button
                        className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
}
