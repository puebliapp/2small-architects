import { createTable } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await createTable();
        return NextResponse.json({ message: 'Table created successfully' });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
