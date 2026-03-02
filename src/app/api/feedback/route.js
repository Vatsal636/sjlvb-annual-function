import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { name, rating, category, comment, is_anonymous } = body;

        if (!rating) {
            return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
        }

        const { v4: uuidv4 } = await import('uuid');
        const id = uuidv4();

        db.prepare(
            'INSERT INTO feedback (id, name, rating, category, comment, is_anonymous) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(id, is_anonymous ? 'Anonymous' : (name || 'Anonymous'), rating, category || 'general', comment || '', is_anonymous ? 1 : 0);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = getDb();
        const feedback = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC').all();
        return NextResponse.json({ feedback });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
