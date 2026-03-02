import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = getDb();
        const tasks = db.prepare(
            'SELECT * FROM tasks ORDER BY CASE priority WHEN \'urgent\' THEN 1 WHEN \'high\' THEN 2 ELSE 3 END, due_date ASC'
        ).all();
        return NextResponse.json({ tasks });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { title, description, assigned_to, assigned_role, priority, due_date } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const { v4: uuidv4 } = await import('uuid');
        const id = uuidv4();

        db.prepare(
            'INSERT INTO tasks (id, title, description, assigned_to, assigned_role, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(id, title, description || '', assigned_to || null, assigned_role || '', 'todo', priority || 'normal', due_date || '');

        return NextResponse.json({ success: true, id });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { id, status, title, description, assigned_role, priority, due_date } = body;

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        if (status) {
            db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
        }

        if (title) {
            db.prepare('UPDATE tasks SET title = ?, description = ?, assigned_role = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(title, description || '', assigned_role || '', priority || 'normal', due_date || '', id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
        }

        db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
