'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './events.module.css';

const categoryConfig = {
    dance: { icon: '💃', color: '#F0A6CA' },
    singing: { icon: '🎤', color: '#77C9D4' },
    drama: { icon: '🎭', color: '#7C6FE0' },
    quiz: { icon: '🧠', color: '#F5C97E' },
    art: { icon: '🎨', color: '#7ECBA1' },
    fashion: { icon: '👗', color: '#E87B7B' },
    music: { icon: '🎸', color: '#F5C97E' },
    culture: { icon: '🎪', color: '#E87B7B' },
};

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/events')
            .then(r => r.json())
            .then(data => {
                setEvents(data.events || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = events;

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2>🎭 Events &amp; Competitions</h2>
                            <p>Explore all events and find the one that matches your talent!</p>
                        </div>
                    </ScrollReveal>



                    {loading ? (
                        <div className="empty-state"><p>Loading events...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎭</div>
                            <p>No events found</p>
                        </div>
                    ) : (
                        <div className={styles.eventsGrid}>
                            {filtered.map((event, i) => {
                                const config = categoryConfig[event.category] || { icon: '🎪', color: '#7C6FE0' };
                                const isExpanded = expanded === event.id;

                                return (
                                    <ScrollReveal animation="scale-in" delay={(i % 6) * 80} key={event.id}>
                                        <div
                                            className={styles.eventCard}
                                            style={{ '--event-accent': config.color }}
                                            onClick={() => setExpanded(isExpanded ? null : event.id)}
                                        >
                                            <div className={styles.eventCardTop} style={{ background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)` }}>
                                                <span className={styles.eventIcon}>{config.icon}</span>
                                                <span className={`badge`} style={{ background: `${config.color}20`, color: config.color }}>
                                                    {event.category}
                                                </span>
                                            </div>

                                            <div className={styles.eventCardBody}>
                                                <h3>{event.name}</h3>
                                                <p className={styles.eventDesc}>{event.description}</p>

                                                <div className={styles.eventMeta}>
                                                    {event.time && <span>🕐 {event.time}</span>}
                                                    {event.venue && <span>📍 {event.venue}</span>}
                                                    {event.max_participants > 0 && <span>👥 Max {event.max_participants}</span>}
                                                </div>

                                                {isExpanded && (
                                                    <div className={styles.eventExpanded}>
                                                        <div className={styles.eventDetail}>
                                                            <strong>Date:</strong> March 15, 2026
                                                        </div>
                                                        <div className={styles.eventDetail}>
                                                            <strong>Status:</strong>
                                                            <span className="badge badge-success">Open for Registration</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <button className={styles.expandBtn}>
                                                    {isExpanded ? 'Show Less ↑' : 'Show More ↓'}
                                                </button>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
