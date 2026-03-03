'use client';

import { useState } from 'react';
import ScrollReveal from '../../components/ScrollReveal';
import styles from './feedback.module.css';

export default function FeedbackPage() {
    const [form, setForm] = useState({ name: '', rating: 0, category: 'general', comment: '', is_anonymous: false });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.rating === 0) {
            alert('Please select a rating!');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('https://formspree.io/f/mojngava', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.is_anonymous ? 'Anonymous' : (form.name || 'Anonymous'),
                    rating: form.rating,
                    category: form.category,
                    comment: form.comment,
                }),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit feedback. Please try again.');
            }
        } catch {
            alert('Failed to submit feedback');
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="page-wrapper">
                <section className="section">
                    <div className="container">
                        <div className={styles.successState}>
                            <span style={{ fontSize: '4rem' }}>🎉</span>
                            <h2>Thank You!</h2>
                            <p>Your feedback has been submitted successfully. It helps us improve future events!</p>
                            <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', rating: 0, category: 'general', comment: '', is_anonymous: false }); }}>
                                Submit Another
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <ScrollReveal animation="fade-up">
                        <div className="section-header">
                            <h2><span className="section-icon">💬</span> Share Your Feedback</h2>
                            <p>Help us improve by sharing your experience and suggestions</p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="scale-in" delay={200}>

                        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
                            <div className={styles.anonymousToggle}>
                                <label className={styles.toggle}>
                                    <input
                                        type="checkbox"
                                        checked={form.is_anonymous}
                                        onChange={e => setForm({ ...form, is_anonymous: e.target.checked })}
                                    />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                                <span>Submit anonymously</span>
                            </div>

                            {!form.is_anonymous && (
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter your name"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Rating</label>
                                <div className={styles.stars}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            type="button"
                                            key={star}
                                            className={`${styles.star} ${star <= (hoverRating || form.rating) ? styles.starActive : ''}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setForm({ ...form, rating: star })}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    {form.rating > 0 && (
                                        <span className={styles.ratingText}>
                                            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][form.rating]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                >
                                    <option value="general">General</option>
                                    <option value="performances">Performances</option>
                                    <option value="decoration">Decoration</option>
                                    <option value="organization">Organization</option>
                                    <option value="food">Food & Refreshments</option>
                                    <option value="venue">Venue & Sound</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Your Feedback</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Share your experience, suggestions, or anything you'd like us to know..."
                                    rows={5}
                                    value={form.comment}
                                    onChange={e => setForm({ ...form, comment: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%' }}>
                                {submitting ? 'Submitting...' : '📬 Submit Feedback'}
                            </button>
                        </form>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
}
