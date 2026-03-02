import getDb from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = getDb();
        const schedule = db.prepare('SELECT * FROM schedule ORDER BY sort_order ASC').all();
        return NextResponse.json({ schedule });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
