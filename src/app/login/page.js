'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
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
                                <span className={styles.authIcon}>🔐</span>
                                <h2>Team Login</h2>
                                <p>Sign in to access the team dashboard</p>
                            </div>

                            {error && <div className="alert alert-error">⚠️ {error}</div>}

                            <form onSubmit={handleSubmit}>
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
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>

                            <div className={styles.authFooter}>
                                <p>Don't have an account? <Link href="/register">Register here</Link></p>
                            </div>

                            <div className={styles.demoCredentials}>
                                <p><strong>Demo:</strong> head@annual.com / admin123</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
