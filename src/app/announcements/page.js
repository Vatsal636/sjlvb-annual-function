'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './announcements.module.css';

const priorityConfig = {
    urgent: { label: '🔴 Urgent', class: 'priority-urgent' },
    important: { label: '🟡 Important', class: 'priority-high' },
    info: { label: '🔵 Info', class: 'priority-normal' },
};

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/announcements')
            .then(r => r.json())
            .then(data => {
                setAnnouncements(data.announcements || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = announcements;

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2>📢 Announcements</h2>
                            <p>Stay updated with the latest news, updates, and important notices</p>
                        </div>
                    </ScrollReveal>



                    {loading ? (
                        <div className="empty-state"><p>Loading announcements...</p></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📢</div>
                            <p>No announcements found</p>
                        </div>
                    ) : (
                        <div className={styles.annList}>
                            {filtered.map((ann, i) => (
                                <ScrollReveal animation="fade-up" delay={i * 100} key={ann.id}>
                                    <div
                                        className={styles.annCard}
                                    >
                                        <div className={styles.annHeader}>
                                            <span className={`priority ${priorityConfig[ann.priority]?.class || 'priority-normal'}`}>
                                                {ann.priority}
                                            </span>
                                            <span className={styles.annDate}>
                                                {new Date(ann.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h3 className={styles.annTitle}>{ann.title}</h3>
                                        <p className={styles.annContent}>{ann.content}</p>
                                        {ann.author && (
                                            <div className={styles.annAuthor}>
                                                👤 {ann.author}
                                            </div>
                                        )}
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
