'use client';

import { useState } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './contact.module.css';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const team = [
        { role: 'Overall Head', name: 'Event Coordinator', emoji: '👑', desc: 'Overall management & coordination' },
        { role: 'Decoration Head', name: 'To be assigned', emoji: '🎨', desc: 'Stage & venue decoration' },
        { role: 'Media Head', name: 'To be assigned', emoji: '📱', desc: 'Social media & content' },
        { role: 'Performances Head', name: 'To be assigned', emoji: '🎭', desc: 'All performances & rehearsals' },
        { role: 'Logistic Head', name: 'To be assigned', emoji: '🚛', desc: 'Logistics, sound, seating' },
        { role: 'Anchoring Head', name: 'To be assigned', emoji: '🎤', desc: 'Anchoring & script' },
    ];

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2><span className="section-icon">📞</span> Contact Us</h2>
                            <p>Have a question, suggestion, or want to participate? Reach out!</p>
                        </div>
                    </ScrollReveal>

                    <div className={styles.contactLayout}>
                        <ScrollReveal animation="fade-left">
                            <div className={styles.formSection}>
                                {submitted ? (
                                    <div className={styles.formSuccess}>
                                        <span style={{ fontSize: '3rem' }}>✅</span>
                                        <h3>Message Sent!</h3>
                                        <p>We'll get back to you soon.</p>
                                        <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                                            Send Another
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        <h3 style={{ marginBottom: 24 }}>Send a Message</h3>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Your name"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Subject</label>
                                            <select
                                                className="form-select"
                                                value={form.subject}
                                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="participation">Event Participation</option>
                                                <option value="volunteer">Volunteering</option>
                                                <option value="general">General Inquiry</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Message</label>
                                            <textarea
                                                className="form-textarea"
                                                placeholder="Your message..."
                                                rows={4}
                                                value={form.message}
                                                onChange={e => setForm({ ...form, message: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                            📬 Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </ScrollReveal>

                        {/* Team Info */}
                        <div className={styles.teamSection}>
                            <h3 style={{ marginBottom: 24 }}>Organizing Team</h3>
                            <div className={styles.teamGrid}>
                                {team.map((member, i) => (
                                    <ScrollReveal animation="fade-right" delay={i * 80} key={member.role}>
                                        <div className={styles.teamCard}>
                                            <span className={styles.teamEmoji}>{member.emoji}</span>
                                            <div>
                                                <div className={styles.teamRole}>{member.role}</div>
                                                <div className={styles.teamName}>{member.name}</div>
                                                <div className={styles.teamDesc}>{member.desc}</div>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
