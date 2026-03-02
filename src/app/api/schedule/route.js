import { NextResponse } from 'next/server';
import { schedule } from '@/lib/data';

export async function GET() {
    return NextResponse.json({ schedule });
}
