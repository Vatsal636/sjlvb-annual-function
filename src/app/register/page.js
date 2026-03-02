'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

const ROLES = ['Overall Head', 'Decoration Head', 'Media Head', 'Performances Head', 'Logistic Head', 'Anchoring Head'];

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.role) {
            setError('Please select a role');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            router.push('/dashboard');
        } catch {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <section className="section">
                <div className="container">
                    <div className={styles.authWrapper}>
                        <div className={`${styles.authCard} animate-fade-in-up`}>
                            <div className={styles.authHeader}>
                                <span className={styles.authIcon}>📝</span>
                                <h2>Team Registration</h2>
                                <p>Register as a team member to access the dashboard</p>
                            </div>

                            {error && <div className="alert alert-error">⚠️ {error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Your full name"
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
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        placeholder="Create a password"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Your Role</label>
                                    <select
                                        className="form-select"
                                        value={form.role}
                                        onChange={e => setForm({ ...form, role: e.target.value })}
                                        required
                                    >
                                        <option value="">Select your role</option>
                                        {ROLES.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>

                            <div className={styles.authFooter}>
                                <p>Already have an account? <Link href="/login">Sign in here</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
