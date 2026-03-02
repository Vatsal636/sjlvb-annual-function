import { NextResponse } from 'next/server';

export async function POST(request) {
    // Mock save for informative site
    return NextResponse.json({ success: true });
}

export async function GET() {
    // Return empty array for informative site
    return NextResponse.json({ feedback: [] });
}
