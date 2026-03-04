'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '../components/ScrollReveal';
import styles from './page.module.css';

const EVENT_DATE = new Date('2026-03-15T09:00:00+05:30');

function getTimeLeft() {
  const now = new Date();
  const diff = EVENT_DATE - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function HomePage() {
  const [time, setTime] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    setTime(getTimeLeft());
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/announcements?limit=3')
      .then(r => r.json())
      .then(data => setAnnouncements(data.announcements || []))
      .catch(() => { });
  }, []);

  const highlights = [
    { icon: '🎭', value: '10+', label: 'Events' },
    { icon: '🎤', value: '100+', label: 'Performers' },
    { icon: '🏆', value: '50+', label: 'Prizes' },
    { icon: '⏰', value: '5 hrs', label: 'Of Fun' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.meshGradient}></div>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>
        <div className="container">
          <div className={`${styles.heroContent} animate-fade-in-up`}>
            <span className={styles.heroTag}>📅 March 15, 2026</span>
            <h1 className={styles.heroTitle}>
              SJLVB & SJLKC<br />
              <span className={styles.heroGradient}>Annual Function</span>
            </h1>
            <p className={styles.heroDesc}>
              A grand celebration of talent, creativity, and togetherness.
              Join us for an unforgettable day of performances, competitions,
              and memories!
            </p>

            <div className="countdown">
              {[
                { value: time ? time.days : '--', label: 'Days' },
                { value: time ? time.hours : '--', label: 'Hours' },
                { value: time ? time.minutes : '--', label: 'Minutes' },
                { value: time ? time.seconds : '--', label: 'Seconds' },
              ].map(item => (
                <div className="countdown-item" key={item.label}>
                  <div className="countdown-value">{typeof item.value === 'number' ? String(item.value).padStart(2, '0') : item.value}</div>
                  <div className="countdown-label">{item.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.heroCtas}>
              <Link href="/events" className="btn btn-primary btn-lg">
                🎭 View Events
              </Link>
              <Link href="/schedule" className="btn btn-secondary btn-lg">
                📅 See Schedule
              </Link>
            </div>
          </div>
        </div>
      </section >

      {/* Highlights Strip */}
      <section className={styles.highlights}>
        <div className="container">
          <div className={styles.highlightGrid}>
            {highlights.map((h, i) => (
              <ScrollReveal
                animation="fade-up"
                delay={i * 100}
                key={h.label}
              >
                <div className={styles.highlightCard}>
                  <span className={styles.highlightIcon}>{h.icon}</span>
                  <span className={styles.highlightValue}>{h.value}</span>
                  <span className={styles.highlightLabel}>{h.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's Happening */}
      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header">
              <h2>🎪 What&apos;s Happening</h2>
              <p>From dances to dramas, singing to music — there&apos;s something for everyone!</p>
            </div>
          </ScrollReveal>
          <div className={styles.eventPreview}>
            {[
              { icon: '💃', title: 'Dance', desc: 'Prayer, Duo, Western, Garba & more', color: '#F0A6CA' },
              { icon: '🎤', title: 'Singing', desc: 'Solo & Group songs', color: '#77C9D4' },
              { icon: '🎭', title: 'Drama & Skit', desc: 'Skits, Mimes & acting', color: '#7C6FE0' },
              { icon: '🎸', title: 'Music', desc: 'Guitar & instrumentals', color: '#F5C97E' },
              { icon: '🎪', title: 'Culture', desc: 'Lok Dayro & traditional arts', color: '#7ECBA1' },
            ].map((evt, i) => (
              <ScrollReveal animation="scale-in" delay={i * 80} key={evt.title}>
                <div
                  className={styles.eventMini}
                  style={{ '--event-color': evt.color }}
                >
                  <div className={styles.eventMiniIcon}>{evt.icon}</div>
                  <h4>{evt.title}</h4>
                  <p>{evt.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal animation="fade-up" delay={400}>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/events" className="btn btn-secondary">
                View All Events →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header">
              <h2>📢 Latest Announcements</h2>
              <p>Stay updated with the latest news and updates</p>
            </div>
          </ScrollReveal>
          {announcements.length > 0 ? (
            <div className={styles.annGrid}>
              {announcements.map((a, i) => (
                <ScrollReveal animation="fade-up" delay={i * 120} key={a.id}>
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className={`priority priority-${a.priority === 'urgent' ? 'urgent' : a.priority === 'important' ? 'high' : 'normal'}`}>
                        {a.priority}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 style={{ marginBottom: 8 }}>{a.title}</h4>
                    <p style={{ fontSize: '0.9rem' }}>{a.content}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📢</div>
              <p>Announcements will appear here</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <ScrollReveal animation="scale-in">
            <div className={styles.ctaCard}>
              <h2>🎪 Ready to Be Part of the Show?</h2>
              <p>Whether you&apos;re a performer, volunteer, or audience — there&apos;s a place for you!</p>
              <div className={styles.heroCtas}>
                <Link href="/events" className="btn btn-primary btn-lg">
                  Explore Events
                </Link>
                <Link href="/contact" className="btn btn-secondary btn-lg">
                  Get in Touch
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
