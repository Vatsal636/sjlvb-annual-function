import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 100;

        const announcements = db.prepare(
            'SELECT * FROM announcements ORDER BY created_at DESC LIMIT ?'
        ).all(limit);

        return NextResponse.json({ announcements });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { title, content, priority, author } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const { v4: uuidv4 } = await import('uuid');
        const id = uuidv4();

        db.prepare(
            'INSERT INTO announcements (id, title, content, priority, author) VALUES (?, ?, ?, ?, ?)'
        ).run(id, title, content, priority || 'info', author || 'Admin');

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
