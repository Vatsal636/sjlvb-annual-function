import { NextResponse } from 'next/server';
import { events } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ events });
}

// POST route removed because this is a static informative site
