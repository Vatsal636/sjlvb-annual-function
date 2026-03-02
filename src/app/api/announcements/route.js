import { NextResponse } from 'next/server';
import { announcements } from '@/lib/data';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Sort descending by created_at and slice by limit
    const sorted = [...announcements].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return NextResponse.json({ announcements: sorted.slice(0, limit) });
}

// POST removed because this is an informative static site
