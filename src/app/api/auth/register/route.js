import getDb from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const VALID_ROLES = ['Overall Head', 'Decoration Head', 'Media Head', 'Performances Head', 'Logistic Head', 'Anchoring Head'];

export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (!VALID_ROLES.includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const id = uuidv4();

        db.prepare(
            'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)'
        ).run(id, name, email, hashedPassword, role);

        const response = NextResponse.json({ success: true, user: { id, name, email, role } });
        response.cookies.set('session', JSON.stringify({ id, name, role, email }), {
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
