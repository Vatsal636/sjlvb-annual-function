import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = getDb();
        const events = db.prepare('SELECT * FROM events ORDER BY time ASC').all();
        return NextResponse.json({ events });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { name, description, category, date, time, venue, max_participants } = body;

        if (!name || !category) {
            return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
        }

        const { v4: uuidv4 } = await import('uuid');
        const id = uuidv4();

        db.prepare(
            'INSERT INTO events (id, name, description, category, date, time, venue, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(id, name, description || '', category, date || '', time || '', venue || '', max_participants || 0);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
