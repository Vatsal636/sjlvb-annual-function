'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './schedule.module.css';

const categoryIcons = {
    ceremony: '🎪',
    performance: '🎭',
    break: '☕',
};

const categoryColors = {
    ceremony: '#7C6FE0',
    performance: '#F0A6CA',
    break: '#7ECBA1',
};

export default function SchedulePage() {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/schedule')
            .then(r => r.json())
            .then(data => {
                setSchedule(data.schedule || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = schedule;

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2><span className="section-icon">📅</span> Event Schedule</h2>
                            <p>The complete day plan for March 15, 2026</p>
                        </div>
                    </ScrollReveal>



                    {loading ? (
                        <div className="empty-state"><p>Loading schedule...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📅</div>
                            <p>No schedule items found</p>
                        </div>
                    ) : (
                        <div className={styles.timeline}>
                            {filtered.map((item, i) => (
                                <ScrollReveal animation="fade-left" delay={i * 100} key={item.id}>
                                    <div
                                        className={styles.timelineItem}
                                        style={{ '--timeline-color': categoryColors[item.category] || 'var(--primary)' }}
                                    >
                                        <div className={styles.timelineDot}></div>
                                        <div className={styles.timelineCard}>
                                            <div className={styles.timelineHeader}>
                                                <span className={styles.timelineTime}>
                                                    🕐 {item.start_time}{item.end_time ? ` — ${item.end_time}` : ''}
                                                </span>
                                                <span className={`badge badge-${item.category === 'ceremony' ? 'primary' : item.category === 'break' ? 'success' : 'info'}`}>
                                                    {categoryIcons[item.category]} {item.category}
                                                </span>
                                            </div>
                                            <h3 className={styles.timelineTitle}>{item.title}</h3>
                                            {item.description && <p className={styles.timelineDesc}>{item.description}</p>}
                                            {item.venue && (
                                                <div className={styles.timelineVenue}>
                                                    📍 {item.venue}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
